import db from '../../datastore'
import { remote } from 'electron'
import path from 'path'

const state = {
  project: null,
  config: '',
  configs: {},
  overrides: {}
}

const mutations = {
  updateProject (state, updates) {
    state.project = {...state.project, ...updates};
  },
  setProject (state, project) {
    state.project = project;
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
  setConfig ({ commit }, configFile) {
    return new Promise((resolve, reject) => {
      try {
        const configPath = path.join(state.project.path, configFile);
        const { config } = remote.require(configPath);
        commit('resetOverrides')
        commit('setConfig', configFile);
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
  mutations,
  actions
}
