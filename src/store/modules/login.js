import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  LOGIN_RUN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  DATA_LOADING_START,
  DATA_LOADING_END,

  TOGGLE_USER_MENU,
  RESET_ALL,
  CHANGE_CODE, CHANGE_STATE
} from '../mutation-types'
import auth from '../../lib/auth'

const initialState = {
  email: '',
  password: '',
  code: '',
  stateValue: '',
  isLdap: false,
  isLoginLoading: false,
  isLoginError: false,
  isDataLoading: false
}

const state = {
  ...initialState
}

const getters = {
  email: state => state.email,
  password: state => state.password,
  code: state => state.code,
  stateValue: state => state.stateValue,
  isLdap: state => state.isLdap,
  isLoginLoading: state => state.isLoginLoading,
  isLoginError: state => state.isLoginError,
  isDataLoading: state => state.isDataLoading
}

const actions = {
  changeEmail ({ commit, state }, email) {
    commit(CHANGE_EMAIL, email)
  },
  changeCode ({ commit, state }, code) {
    commit(CHANGE_CODE, code)
  },
  changeState ({ commit, state }, stateValue) {
    commit(CHANGE_STATE, stateValue)
  },

  changePassword ({ commit, state }, password) {
    commit(CHANGE_PASSWORD, password)
  },

  logIn ({ commit, state }, callback) {
    commit(LOGIN_RUN)
    auth.logIn(
      state.email,
      state.password,
      (err) => {
        if (err) {
          commit(LOGIN_FAILURE)
          callback(err, false)
        } else {
          commit(LOGIN_SUCCESS)
          callback(null, true)
        }
      }
    )
  },

  logout ({ commit, state }, callback) {
    auth.logout((err) => {
      if (err) {
        commit(LOGOUT_FAILURE)
        callback(null, false)
      } else {
        commit(RESET_ALL)
        commit(LOGOUT_SUCCESS)
        commit(TOGGLE_USER_MENU)
        callback(null, true)
      }
    })
  },
  ssoLogIn ({ commit, state }, callback) {
    commit(LOGIN_RUN)
    auth.ssoLogIn(
      state.code,
      state.stateValue,
      (err) => {
        if (err) {
          commit(LOGIN_FAILURE)
          callback(err, false)
        } else {
          commit(LOGIN_SUCCESS)
          callback(null, true)
        }
      }
    )
  },

  resetPassword ({ commit }, email) {
    return new Promise((resolve, reject) => {
      auth.resetPassword(email)
        .then(resolve)
        .catch(reject)
    })
  },

  resetChangePassword ({ commit }, { token, password, password2 }) {
    return new Promise((resolve, reject) => {
      auth.resetChangePassword(token, password, password2)
        .then(() => {
          commit(LOGIN_SUCCESS)
          resolve()
        })
        .catch(reject)
    })
  }
}

const mutations = {
  [CHANGE_EMAIL] (state, email) {
    state.email = email
  },

  [CHANGE_PASSWORD] (state, password) {
    state.password = password
  },

  [LOGIN_RUN] (state) {
    state.isLoginLoading = true
    state.isLoginError = false
  },

  [LOGIN_SUCCESS] (state, email) {
    state.isLoginLoading = false
    state.isLoginError = false
  },

  [LOGIN_FAILURE] (state, email) {
    state.isLoginLoading = false
    state.isLoginError = true
  },

  [LOGOUT_SUCCESS] (state, email) {
    state.isLoginLoading = false
    state.isLoginError = false
  },

  [DATA_LOADING_START] (state, payload) {
    state.isDataLoading = true
    if (payload && payload.isLdap !== undefined) state.isLdap = payload.isLdap
  },

  [DATA_LOADING_END] (state) {
    state.isDataLoading = false
  },
  [CHANGE_CODE] (state, code) {
    state.code = code
  },
  [CHANGE_STATE] (state, stateValue) {
    state.stateValue = stateValue
  },

  [RESET_ALL] (state, email) {
    Object.assign(state, { ...initialState })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
