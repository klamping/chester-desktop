const ipc = require('electron').ipcMain
// const { spawn } = require('child_process');
const pty = require('node-pty');
// const os = require('os');
// const spawn = require('cross-spawn');
const fixPath = require('fix-path');
// const which = require('which')

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

ipc.on('run-test', function (event, cwd, envVars, command, args) {
  event.sender.send('test-status', 'Test Started', 'info')

  // create an empty object to hold env variables
  const env = { ...process.env };

  if (envVars.length > 0) {
    const splitVars = envVars.split(' ');

    splitVars.forEach(envVar => {
      const separated = envVar.split('=');
      env[separated[0]] = separated[1];
    })
  }

  const splitCommand = command.split(' ');

  let shiftedArgs = args;
  if (splitCommand.length > 1) {
    shiftedArgs = [...splitCommand.splice(1), ...args]
  }

  // const resolved = which.sync('node', {nothrow: true});

  childProcess = pty.spawn(splitCommand[0], shiftedArgs, {
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
