const ipc = require('electron').ipcMain
// const { spawn } = require('child_process');
const pty = require('node-pty');
// const os = require('os');
// const spawn = require('cross-spawn');
const fixPath = require('fix-path');

fixPath();

let childProcess;

// const shell = childProcess.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
//
// ipc.on('start-term', function (event, folderPath) {
//   if (childProcess) {
//     console.log('test-runner.js :15, killing old proces');
//     childProcess.kill();
//   }

//   childProcess = pty.spawn(shell, [], {
//     name: 'xterm-color',
//     cwd: folderPath,
//     env: childProcess.env
//   });

//   childProcess.on('data', (data) => {
//     console.log('test-runner.js :26', data);
//     event.sender.send('test-log', data.toString('utf8'));
//   });
// });

ipc.on('xterm', function (event, data) {
  if (childProcess) {
    childProcess.write(data);
    // event.sender.send('debug', data);
  }
});

ipc.on('run-test', function (event, cwd, env, command, args) {
  event.sender.send('test-status', 'Test Started', 'info')

  childProcess = pty.spawn(command, args, {
    cwd,
    env
  })

  childProcess.on('data', (data) => {
    event.sender.send('test-log', data.toString());
  });

  // childProcess.stderr.on('data', (data) => {
  //   console.log('test-runner.js :53');
  //   event.sender.send('test-log', data.toString());
  // });

  childProcess.on('exit', (code, signal) => {
    childProcess = null;
    if (code !== 0) {
      // save broken screenshot?
      event.sender.send('test-status', 'Test Run Failure!', 'error');
    } else {
      event.sender.send('test-status', 'Test Successful', 'success');
    }
  });
})

ipc.on('send-sigint', function () {
  childProcess.kill('SIGINT');
})
