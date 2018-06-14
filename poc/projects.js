const {dialog} = require('electron').remote;
const {promisify} = require('util');
const Datastore = require('nedb')
const db = new Datastore({ filename: './tmp/datafile', autoload: true });

const addProjectBtn = document.getElementById('add-project')
const projectList = document.getElementById('project-list')

addProjectBtn.addEventListener('click', function (event) {
  var path = dialog.showOpenDialog({
      properties: ['openDirectory']
  });

  storeProject(path);
})

function storeProject (path) {
  db.insert({
    path
  }, (err, doc) => {
    if (err) {
      console.error(err);
      return;
    }
    getProjects();
  });
}

function getProjects () {
  db.find({}, (err, projects) => {
    if (err) {
      console.error(err);
      return;
    }

    if (projects.length === 0) {
      projectList.innerHTML = `<li>No projects added</li>`;
      return;
    }

    let htmlList = projects.map(project => {
      return `<li>${project.path} <button data-action="run-test" data-project="${project._id}">Run</button></li>`;
    })

    projectList.innerHTML = htmlList.join('');

    const testBtn = document.querySelector('[data-action="run-test"]');
    testBtn.addEventListener('click', function (event) {
      log.innerHTML = '';
      status.innerHTML = '';
      ipc.send('run-test', this.dataset['project-id']);
    })
  });
}

getProjects();