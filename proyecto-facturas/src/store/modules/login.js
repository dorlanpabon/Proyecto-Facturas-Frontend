//vuex store modulo login
const login = {
    state: {
        token: null,
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        isLoading: state => state.isLoading,
        error: state => state.error,
        user: state => state.user,
        token: state => state.token
    },
    mutations: {
        setToken: (state, token) => {
            state.token = token
            state.isLoggedIn = !!token
        },
        setUser: (state, user) => {
            state.user = user
        },
        setLoading: (state, isLoading) => {
            state.isLoading = isLoading
        },
        setError: (state, error) => {
            state.error = error
        },
        clearError: state => {
            state.error = null
        },
        clearState: state => {
            state.token = null
            state.user = null
            state.isLoggedIn = false
            state.isLoading = false
            state.error = null
        },
        logout: state => {
            state.token = null
            state.user = null
            state.isLoggedIn = false
        },
        login: (state, user) => {
            state.user = user
            state.isLoggedIn = true
        }
    },
    actions: {
        setToken: ({ commit }, token) => {
            commit('setToken', token)
        },
        setUser: ({ commit }, user) => {
            commit('setUser', user)
        },
        setLoading: ({ commit }, isLoading) => {
            commit('setLoading', isLoading)
        },
        setError: ({ commit }, error) => {
            commit('setError', error)
        },
        clearError: ({ commit }) => {
            commit('clearError')
        },
        clearState: ({ commit }) => {
            commit('clearState')
        },
        logout: ({ commit }) => {
            commit('logout')
        },
        login: ({ commit }, user) => {
            commit('login', user)
        },
        clearErrorAndState: ({ commit }) => {
            commit('clearError')
            commit('clearState')
        }
    }
}

export default login