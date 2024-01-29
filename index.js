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
  try {
    const {
      config,
      run,
      handleEvent
    } = require(path.join(script, file));
    if (config) {
      if (handleEvent) {
        Utils.handleEvent.set(config.name.toLowerCase(), {
          name: config.name.toLowerCase()
        });
        Utils.handleEvent.get(config.name).handleEvent = handleEvent;
      }
      if (run) {
        Utils.commands.set(config.name.toLowerCase(), {
          name: config.name.toLowerCase()
        });
        Utils.commands.get(config.name).run = run;
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
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
app.post('/login', (req, res) => {
  const {
    state
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
        accountLogin(state).then(() => {
          res.status(200).json({
            success: true,
            message: 'Authentication process completed successfully; login achieved.'
          });
        }).catch((error) => {
          console.error(error);
          res.status(400).json({
            error: true,
            message: error
          });
        });
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
async function accountLogin(state) {
  return new Promise((resolve, reject) => {
    login({
      appState: state
    }, async (error, api) => {
      if (error) {
        console.error('Error during login:');
        reject(error);
        return;
      }
      const userid = await api.getCurrentUserID();
      if (!userid) {
        console.error('User ID is not available.');
        reject(new Error('User ID is not available.'));
        return;
      }
      try {
        const userInfo = await api.getUserInfo(userid);
        if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) return;
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
              listenEmitter.stopListening();
              reject(new Error(`Error during API listen: ${error}`));
              return;
            }
          }
          const [command, ...args] = (event.body || '').trim().split(/\s+/).map(arg => arg.trim());
          switch (event.type) {
            case 'message':
            case 'message_reply':
              await (Utils.commands.get(command?.toLowerCase())?.run ?? (() => {}))(api, event, args);
              break;
            case 'event':
              for (const {
                  handleEvent
                }
                of Utils.handleEvent.values()) {
                handleEvent && handleEvent(api, event);
              }
              break;
          }
        });
      } catch (error) {
        console.error('Error during API listen, outside of listen', userid);
        Utils.account.delete(userid);
        reject(error);
        return;
      }
      resolve();
    });
  });
}
