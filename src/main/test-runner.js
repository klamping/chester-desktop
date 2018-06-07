const ipc = require('electron').ipcMain
const { spawn } = require('child_process');
// const path = require('path');

ipc.on('run-test', function (event, folderPath, command) {
  event.sender.send('test-status', 'started')

  // const splitCommand = command.split(' ');
  // let commandArgs = (splitCommand.length > 1)
  //   ? splitCommand.slice(1, splitCommand.length)
  //   : [];

  // const currentDir = path.join(process.cwd(), __dirname);

  console.log('test-runner.js :15', folderPath);

  const run = spawn('./node_modules/.bin/wdio', [], {
    cwd: folderPath
  });

  run.stdout.on('data', (data) => {
    console.log('test-runner.js :25', data.toString('utf8'));
    event.sender.send('test-log', data);
  });

  run.stderr.on('data', (data) => {
    console.log('test-runner.js :31', data.toString('utf8'));
    event.sender.send('test-log', data);
  });

  run.on('close', (code) => {
    console.log('test-runner.js :23', code);
    if (code !== 0) {
      // save broken screenshot?
      event.sender.send('test-status', 'Run failed');
    } else {
      event.sender.send('test-status', 'Run Successful');
    }
  });
})
