import db from '../../datastore'
import { remote } from 'electron'
import path from 'path'

const initialState = {
  project: null,
  envVars: [],
  config: '',
  configs: {},
  overrides: {},
  userConfigs: []
}

const state = {
  ...initialState
}

const getters = {
  fullConfigPath: state => {
    return state.config ? path.join(state.project.path, state.config) : '';
  }
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
    state.configs = {}
    state.overrides = {};
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
  resetProject (state) {
    state = { ...initialState };
  },
  resetOverrides (state) {
    state.overrides = {};
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
    commit('resetProject')
    return new Promise((resolve, reject) => {
      db.findOne({ _id: projectId }, (err, project) => {
        if (err) {
          reject(err);
        }

        commit('setProject', project)
        resolve(project);
      });
    });
  },
  setConfig ({ commit, state }, configFile) {
    commit('setConfig', configFile);

    if (configFile) {
      return new Promise((resolve, reject) => {
        try {
          const fullPath = getters.fullConfigPath(state);

          const { config } = remote.require(fullPath);
          commit('setConfigs', config);
          resolve(config);
        } catch (e) {
          reject(e);
        }
      });
    }
  },
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}
