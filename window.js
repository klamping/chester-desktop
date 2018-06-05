const ipc = require('electron').ipcRenderer
const {dialog} = require('electron').remote;
const AU = require('ansi_up');
const ansi_up = new AU.default;

const testBtn = document.getElementById('run-test')
const folderBtn = document.getElementById('folder-path')
const log = document.getElementById('info-log');
const status = document.querySelector('#info-status span');

ipc.on('test-status', function (event, statusMsg) {
  status.innerHTML = statusMsg;
})

ipc.on('test-log', function (event, msg) {
  var html = ansi_up.ansi_to_html(msg);
  log.innerHTML += `${html}<br />`;
})


testBtn.addEventListener('click', function (event) {
  log.innerHTML = '';
  status.innerHTML = '';
  ipc.send('run-test', folderBtn.value);
})

folderBtn.addEventListener('click', function (event) {
  var path = dialog.showOpenDialog({
      properties: ['openDirectory']
  });
  this.value = path;
})