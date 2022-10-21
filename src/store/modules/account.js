export default {
  namespaced: true,
  state: {
    user: undefined,
    permissions: null,
    roles: null,
    departs: undefined,
    dictionaries: null,
    routesConfig: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },

    departs: state => {
      if (!state.departs) {
        try {
          const departs = localStorage.getItem(process.env.VUE_APP_DEPARTS_KEY)
          state.departs = JSON.parse(departs)
        } catch (e) {
          console.error(e)
        }
      }
      return state.departs
    },

    dictionaries: state => {
      if (!state.dictionaries) {
        try {
          const dictionaries = localStorage.getItem(process.env.VUE_APP_DICTS_KEY)
          state.dictionaries = JSON.parse(dictionaries)
          state.dictionaries = state.dictionaries ? state.dictionaries : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.dictionaries
    },

    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles))
    },
    setDeparts(state, departs) {
      state.departs = departs
      localStorage.setItem(process.env.VUE_APP_DEPARTS_KEY, JSON.stringify(departs))
    },
    setDictionaries(state, dictionaries) {
      state.dictionaries = dictionaries
      localStorage.setItem(process.env.VUE_APP_DICTS_KEY, JSON.stringify(dictionaries))
    },

    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
    }
  }
}
