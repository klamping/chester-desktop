const ipc = require('electron').ipcMain
// const { spawn } = require('child_process');
const pty = require('node-pty');
const os = require('os');
const fixPath = require('fix-path');

fixPath();

let ptyProcess;

const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];

ipc.on('start-term', function (event, folderPath) {
  if (ptyProcess) {
    console.log('test-runner.js :15, killing old proces');
    ptyProcess.kill();
  }

  ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cwd: folderPath,
    env: process.env
  });

  ptyProcess.on('data', (data) => {
    console.log('test-runner.js :26', data);
    event.sender.send('test-log', data.toString('utf8'));
  });
});

ipc.on('xterm', function (event, data) {
  if (ptyProcess) {
    ptyProcess.write(data);
  }
});

ipc.on('run-test', function (event, command) {
  event.sender.send('test-status', 'Test Started', 'info')

  ptyProcess.write(`${command}\r`);

  ptyProcess.on('exit', (code) => {
    console.log('test-runner.js :49', 'exit');
  })

  // ptyProcess.on('close', (code) => {
  //   console.log('test-runner.js :51', 'process closed');
  //   if (code !== 0) {
  //     // save broken screenshot?
  //     event.sender.send('test-status', 'Test Run Failure!', 'error');
  //   } else {
  //     event.sender.send('test-status', 'Test Successful', 'success');
  //   }
  // });
})

ipc.on('send-sigint', function () {
  ptyProcess.kill('SIGINT');
})
