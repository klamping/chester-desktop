const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const { spawn } = require('child_process');

ipc.on('run-test', function (event, path) {
  event.sender.send('test-status', 'started')

  const currentDir = __dirname;
  path = '/Users/klamping/wdio-wed/wdio-stable';

  let run = spawn('node', [`${currentDir}/launch-test.js`], {
    cwd: path
  });

  run.stdout.on('data', (data) => {
    event.sender.send('test-log', data);
  });

  run.stderr.on('data', (data) => {
    event.sender.send('test-log', data);
  });

  run.on('close', (code) => {
    if (code !== 0) {
      // save broken screenshot?
      event.sender.send('test-status', 'Run failed');
    } else {
      event.sender.send('test-status', 'Run Successful');
    }

  });
})