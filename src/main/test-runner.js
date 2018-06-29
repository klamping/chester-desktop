const ipc = require('electron').ipcMain
const { spawn } = require('child_process');
const fixPath = require('fix-path');

fixPath();

let currentRun;

ipc.on('run-test', function (event, folderPath, command) {
  event.sender.send('test-status', 'Test Started', 'info')

  currentRun = spawn(command, {
    cwd: folderPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  currentRun.stdout.on('data', (data) => {
    event.sender.send('test-log', data.toString('utf8'));
  });

  currentRun.stderr.on('data', (data) => {
    event.sender.send('test-log', data.toString('utf8'));
  });

  currentRun.on('close', (code) => {
    currentRun = null;
    if (code !== 0) {
      // save broken screenshot?
      event.sender.send('test-status', 'Test Run Failure!', 'error');
    } else {
      event.sender.send('test-status', 'Test Successful', 'success');
    }
  });
})

// ipc.on('debug-command', function (command) {

// })
