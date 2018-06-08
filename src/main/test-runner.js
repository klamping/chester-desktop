const ipc = require('electron').ipcMain
const { spawn } = require('child_process');

ipc.on('run-test', function (event, folderPath, command) {
  event.sender.send('test-status', 'Started')

  const run = spawn(command, [], {
    cwd: folderPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  run.stdout.on('data', (data) => {
    event.sender.send('test-log', data.toString('utf8'));
  });

  run.stderr.on('data', (data) => {
    event.sender.send('test-log', data);
  });

  run.on('close', (code) => {
    if (code !== 0) {
      // save broken screenshot?
      event.sender.send('test-status', 'Failed');
    } else {
      event.sender.send('test-status', 'Successful');
    }
  });
})
