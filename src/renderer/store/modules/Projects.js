import db from '../../datastore'

const state = {
  all: [],
  isLoaded: false
}

const mutations = {
  add (state, project) {
    // todo validate data
    state.all.push(project)
    db.insert(project)
  },
  remove (state, project) {
    state.all = state.all.filter(p => p !== project)
    db.remove({ _id: project._id })
  },
  set (state, projects) {
    state.all = projects
  }
}

const actions = {
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
