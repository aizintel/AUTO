const fs = require('fs');
const path = require('path');
const login = require('./api/index');
const cliProgress = require('cli-progress');
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


const progressBar = new cliProgress.SingleBar(
  {
    format: `Installation Progress |${chalk.cyan('{bar}')}| {percentage}% | {value}/{total} Commands/Events | ETA: {eta}s`,
  },
  cliProgress.Presets.shades_classic
);


progressBar.start(fs.readdirSync(script).length, 0);

fs.readdirSync(script).forEach((file, index) => {
  try {
    const { config, run, handleEvent } = require(path.join(script, file));
    if (config) {
      if (handleEvent) {
        Utils.handleEvent.set(config.name.toLowerCase(), { name: config.name.toLowerCase() });
        Utils.handleEvent.get(config.name).handleEvent = handleEvent;
      
      }
      if (run) {
        Utils.commands.set(config.name.toLowerCase(), { name: config.name.toLowerCase() });
        Utils.commands.get(config.name).run = run;
     
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
  } finally {
    progressBar.update(index + 1);
  }
});

progressBar.stop();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/info', (req, res) => { 
  
  const data = Array.from(Utils.account.values()).map(account => ({
    name: account.name,
    profileUrl: account.profileUrl,
    thumbSrc: account.thumbSrc
  }));

  res.json(JSON.parse(JSON.stringify(data, null, 2)));
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/login', (req, res) => {
  try {
    const { state } = req.body;

    if (!state) throw new Error('Missing app state data');

    const cUser = state.find(item => item.key === 'c_user');
  
    if (cUser) {
      const existingUser = Utils.account.get(cUser.value);

      if (existingUser) {
        console.log(`User ${cUser.value} is already logged in`);
        return res.status(400).json({ error: false, message: "Active user session detected; already logged in", user: existingUser });
      } else {
        accountLogin(state);
        return res.status(200).json({ success: true, message: 'Authentication process completed successfully; login achieved.' });
      }
    } else {
      return res.status(400).json({ error: false, message: "There's an issue with the appstate data; it's invalid." });
    }

  } catch (error) {
    return res.status(400).json({ error: false, message: "There's an issue with the appstate data; it's invalid." });
  }
});



app.listen(5000, () => {
  console.log(`Server is running at http://localhost:5000`);
});

async function accountLogin(state) {
  try {
    login({ appState: state }, async (err, api) => {
      if (err) {
        console.error(chalk.red('Error during login:', err));
        return;
      }

      try {
        const userid = api.getCurrentUserID();

        if (!userid) {
          console.error('User ID is not available.');
          return;
        }

        try {
          let { name, profileUrl, thumbSrc } = (await api.getUserInfo(userid))[userid];
          Utils.account.set(userid, { name, profileUrl, thumbSrc });
        } catch (userInfoError) {
          console.error('Error fetching user info:', userInfoError);
          return;
        }

        var cron = require('node-cron');

        api.sendMessage('We are pleased to inform you that the AI, currently active, has successfully established a connection within the system.', 100054810196686);

        cron.schedule('*/5 * * * *', () => {
           try {         
              api.sendMessage(`AI: ${api.getCurrentUserID()} is up, running check every 5-minutes.`, 100054810196686);
            } catch (cronJobError) {
              console.error('Error during cron job execution:', cronJobError);
              Utils.account.delete(userid);
              return;
           }
        });

      } catch (cronError) {
        console.error('Error during cron setup:', cronError);
        Utils.account.delete(userid);
        return;
      }

      api.setOptions({ listenEvents: true, logLevel: 'silent' });

      api.listen(async (err, event) => {
        try {
          if (err) {
            console.log('Error in API listen:', err);
            return;
          }

          const [command, ...args] = (event.body || "").trim().split(/\s+/).map(arg => arg.trim());

          switch (event.type) {
            case 'message':
            case 'message_reply':
              await (Utils.commands.get(command?.toLowerCase())?.run ?? (() => { }))(api, event, args);
              break;
            case 'event':
              for (const { handleEvent } of Utils.handleEvent.values()) {
                handleEvent && handleEvent(api, event);
              }
              break;
          }
        } catch (listenError) {
          console.error('Error during API listen:', listenError);
        }
      });
    });
  } catch (loginError) {
    console.error('Error outside login callback:', loginError);
  }
}










