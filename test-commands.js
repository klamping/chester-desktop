const ipc = require('electron').ipcRenderer
const AU = require('ansi_up');
const ansi_up = new AU.default;

const status = document.querySelector('#info-status span');
const log = document.getElementById('info-log');

ipc.on('test-status', function (event, statusMsg) {
  status.innerHTML = statusMsg;
})

ipc.on('test-log', function (event, msg) {
  var html = ansi_up.ansi_to_html(msg);
  log.innerHTML += `${html}<br />`;
})