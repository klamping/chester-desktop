import db from '../../datastore'

const state = {
  all: [],
  isLoaded: false
}

const mutations = {
  add (state, project) {
    state.all = [...state.all, project];
  },
  remove (state, projectId) {
    db.remove({ _id: projectId }, {}, function (err, numRemoved) {
      if (err) {
        console.error(err);
      }
    });
    state.all = state.all.filter(p => p._id !== projectId)
  },
  set (state, projects) {
    state.all = projects
  }
}

const actions = {
  addProject ({ commit }, project) {
    // todo validate data
    db.insert(project, function (err, newDoc) {
      if (err) {
        console.error(err);
        return;
      }
      commit('add', newDoc)
    });
  },
  getProjects ({ commit }) {
    db.find({}, (err, projects) => {
      if (err) {
        console.error(err);
        return;
      }

      commit('set', projects)
    });
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions
}
