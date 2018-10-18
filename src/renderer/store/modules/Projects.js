import db from '../../datastore'

const state = {
  all: [],
  isLoaded: false
}

const mutations = {
  add (state, project) {
    state.all = [...state.all, project];
  },
  update (state, project) {
    // overwrite
    state.all = state.all.map(p => {
      if (p._id === project._id) {
        return project
      }
      return p
    })
  },
  remove (state, projectId) {
    state.all = state.all.filter(p => p._id !== projectId)
  },
  set (state, projects) {
    state.all = projects
  }
};

const actions = {
  addProject ({ commit }, project) {
    // todo validate data
    return new Promise((resolve, reject) => {
      db.insert(project, function (err, newDoc) {
        if (err) {
          reject(err);
        }
        commit('add', newDoc);
        resolve(newDoc);
      });
    })
  },
  updateProject ({ commit }, project) {
    // todo validate data
    return new Promise((resolve, reject) => {
      db.update({ _id: project._id }, project, function (err, numReplaced) {
        if (err) {
          reject(err);
        }
        commit('update', project);
        resolve(numReplaced);
      });
    })
  },
  remove ({ commit }, projectId) {
    return new Promise((resolve, reject) => {
      db.remove({ _id: projectId }, {}, function (err, numRemoved) {
        if (err) {
          reject(err);
        }
        commit('remove', projectId)
        resolve();
      });
    });
  },
  getProjects ({ commit }) {
    return new Promise((resolve, reject) => {
      db.find({}, (err, projects) => {
        if (err) {
          reject(err)
        }

        commit('set', projects)
        resolve(projects);
      });
    });
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions
}
