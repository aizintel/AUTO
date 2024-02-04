const fs = require('fs');
const path = require('path');
const login = require('./fb-chat-api/index');
const chalk = require('chalk');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const script = path.join(__dirname, 'script');
const Utils = new Object({
  commands: new Map(),
  handleEvent: new Map(),
  account: new Map(),
});
fs.readdirSync(script).forEach((file) => {
  const scripts = path.join(script, file);
  const stats = fs.statSync(scripts);
  if (stats.isDirectory()) {
    fs.readdirSync(scripts).forEach((file) => {
      try {
        const {
          config,
          run,
          handleEvent
        } = require(path.join(scripts, file));
        if (config) {
          const name = config.name.toLowerCase();
          if (run) {
            Utils.commands.set(name, {
              name,
              run
            });
          }
          if (handleEvent) {
            Utils.handleEvent.set(name, {
              name,
              handleEvent
            });
          }
        }
      } catch (error) {
        console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
      }
    });
  } else {
    try {
      const {
        config,
        run,
        handleEvent
      } = require(scripts);
      if (config) {
        const name = config.name.toLowerCase();
        if (run) {
          Utils.commands.set(name, {
            name,
            run
          });
        }
        if (handleEvent) {
          Utils.handleEvent.set(name, {
            name,
            handleEvent
          });
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
    }
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
const routes = [{
  path: '/',
  file: 'index.html'
}, {
  path: '/step_by_step_guide',
  file: 'guide.html'
}, {
  path: '/online_user',
  file: 'online.html'
}, ];
routes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', route.file));
  });
});
app.get('/info', (req, res) => {
  const data = Array.from(Utils.account.values()).map(account => ({
    name: account.name,
    profileUrl: account.profileUrl,
    thumbSrc: account.thumbSrc,
    time: account.time
  }));
  res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
  const command = new Set();
  const commands = [...Utils.commands.values()].map(({
    name
  }) => (command.add(name), name));
  const handleEvent = [...Utils.handleEvent.values()].map(({
    name
  }) => command.has(name) ? null : (command.add(name), name)).filter(Boolean);
  res.json(JSON.parse(JSON.stringify({
    commands,
    handleEvent
  }, null, 2)));
});
app.post('/login', async (req, res) => {
  const {
    state,
    commands
  } = req.body;
  try {
    if (!state) {
      throw new Error('Missing app state data');
    }
    const cUser = state.find(item => item.key === 'c_user');
    if (cUser) {
      const existingUser = Utils.account.get(cUser.value);
      if (existingUser) {
        console.log(`User ${cUser.value} is already logged in`);
        return res.status(400).json({
          error: false,
          message: "Active user session detected; already logged in",
          user: existingUser
        });
      } else {
        try {
          await accountLogin(state, commands);
          res.status(200).json({
            success: true,
            message: 'Authentication process completed successfully; login achieved.'
          });
        } catch (error) {
          console.error(error);
          res.status(400).json({
            error: true,
            message: error.message
          });
        }
      }
    } else {
      return res.status(400).json({
        error: true,
        message: "There's an issue with the appstate data; it's invalid."
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "There's an issue with the appstate data; it's invalid."
    });
  }
});
app.listen(5000, () => {
  console.log(`Server is running at http://localhost:5000`);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = []) {
  return new Promise((resolve, reject) => {
    login({
      appState: state
    }, async (error, api) => {
      if (error) {
        reject(error);
        return;
      }
      const userid = await api.getCurrentUserID();
      addUser(userid, enableCommands, state);
      try {
        const userInfo = await api.getUserInfo(userid);
        if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) throw new Error('Unable to locate the account; it appears to be in a suspended or locked state.');
        const {
          name,
          profileUrl,
          thumbSrc
        } = userInfo[userid];
        Utils.account.set(userid, {
          name,
          profileUrl,
          thumbSrc,
          time: 0
        });
        const intervalId = setInterval(() => {
          try {
            const account = Utils.account.get(userid);
            if (!account) throw new Error('Account not found');
            Utils.account.set(userid, {
              ...account,
              time: account.time + 1
            });
          } catch (error) {
            clearInterval(intervalId);
            return;
          }
        }, 1000);
      } catch (error) {
        reject(error);
        return;
      }
      api.setOptions({
        listenEvents: true,
        logLevel: 'silent'
      });
      try {
        var listenEmitter = api.listenMqtt(async (error, event) => {
          if (error) {
            if (error === 'Connection closed.') {
              console.error(`Error during API listen: ${error}`, userid);
              Utils.account.delete(userid);
              deleteUser(userid);
              listenEmitter.stopListening();
              return;
            }
          }
          const [command, ...args] = (event.body || '').trim().split(/\s+/).map(arg => arg.trim());
          for (const {
              handleEvent,
              name
            }
            of Utils.handleEvent.values()) {
            if (handleEvent && name && (
                (enableCommands[1].handleEvent || []).includes(name) || (enableCommands[0].commands || []).includes(name))) {
              handleEvent({
                api,
                event,
                enableCommands
              });
            }
          }
          switch (event.type) {
            case 'message':
            case 'message_reply':
            case 'message_unsend':
            case 'message_reaction':
              if (enableCommands[0].commands.includes(command?.toLowerCase())) {
                await ((Utils.commands.get(command?.toLowerCase())?.run || (() => {}))({
                  api,
                  event,
                  args,
                  enableCommands
                }));
              }
              break;
          }
        });
      } catch (error) {
        console.error('Error during API listen, outside of listen', userid);
        Utils.account.delete(userid);
        deleteUser(userid);
        return;
      }
      resolve();
    });
  });
}

async function deleteUser(userid) {
  const configFile = './config.json';
  let config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  const sessionFile = path.join('./session', `${userid}.json`);
 
  const index = config.findIndex(item => item.userid === userid);
  if (index !== -1) config.splice(index, 1);

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

  try {
    fs.unlinkSync(sessionFile);
  } catch (error) {
    console.log(error);
  }
}

async function addUser(userid, enableCommands, state) {
    const configFile = './config.json';
    const sessionFolder = './session';
  
    const sessionFile = path.join(sessionFolder, `${userid}.json`);
    if (fs.existsSync(sessionFile)) return;

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    config.push({ userid, enableCommands });
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

    
    fs.writeFileSync(sessionFile, JSON.stringify(state));
}

async function main() {
    const configFile = './config.json';
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const sessionFolder = path.join(__dirname, 'session');

    fs.existsSync(sessionFolder) || fs.mkdirSync(sessionFolder);

    try {
        for (const file of fs.readdirSync(sessionFolder)) {
            const filePath = path.join(sessionFolder, file);

            try {
                const state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const userid = path.parse(file).name;
                const user = config.find(item => item.userid === userid);
                if (user) {
                    try {
                      const enableCommands = user.enableCommands;
                      await accountLogin(state, enableCommands);
                    } catch (error) {
                      deleteUser(userid);
                    }
                }
            } catch (error) {
              
            }
        }
    } catch (error) {
    
    }
}
main()
