import db from '../../datastore'
import { remote } from 'electron'
import path from 'path'

const state = {
  project: null,
  envVars: '',
  config: '',
  configs: {},
  overrides: {}
}

const getters = {
  fullConfigPath: state => {
    return path.join(state.project.path, state.config)
  }
}

const mutations = {
  updateProject (state, updates) {
    state.project = {...state.project, ...updates};
  },
  setProject (state, project) {
    state.project = project;
  },
  setEnvVars (state, envVars) {
    state.envVars = envVars;
  },
  setConfig (state, config) {
    state.config = config;
  },
  setConfigs (state, settings) {
    state.configs = settings;
  },
  setOverride (state, override) {
    state.overrides = { ...state.overrides, ...override };
  },
  removeOverride (state, prop) {
    if (state.overrides) {
      const updatedOverrides = { ...state.overrides };
      delete updatedOverrides[prop];
      state.overrides = updatedOverrides;
    }
  },
  resetOverrides (state) {
    state.overrides = null;
  },
}

const actions = {
  updateProject ({ commit, state }, updates) {
    return new Promise((resolve, reject) => {
      db.update({ _id: state.project._id }, { $set: updates }, {}, function (err, numReplaced) {
        if (err) {
          reject(err);
        }
        commit('updateProject', updates)
        resolve();
      });
    });
  },
  setProject ({ commit }, projectId) {
    return new Promise((resolve, reject) => {
      db.findOne({ _id: projectId }, (err, project) => {
        if (err) {
          reject(err);
        }

        commit('resetOverrides')
        commit('setProject', project)
        resolve(project);
      });
    });
  },
  setConfig ({ commit, state }, configFile) {
    return new Promise((resolve, reject) => {
      try {
        commit('setConfig', configFile);
        const { config } = remote.require(getters.fullConfigPath(state));
        commit('resetOverrides')
        commit('setConfigs', config);
        resolve(config);
      } catch (e) {
        reject(e);
      }
    });
  },
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}
