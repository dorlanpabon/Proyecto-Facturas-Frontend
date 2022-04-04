//vuex store modulo login
import axios from 'axios'
import router from '../../router'

const auth = {
    state: () => ({
        token: null,
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        isError: false,
    }),
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
        setIsError: (state, isError) => {
            state.isError = isError
        },
        clearError: state => {
            state.error = null
            state.isError = false
        },
        clearState: state => {
            state.token = null
            state.user = null
            state.isLoggedIn = false
            state.isLoading = false
            state.error = null
            state.isError = false
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
            commit('clearState')
            router.push('/')
        },
        login: async ({ commit }, user) => {
            try {
                //set token
                const res = await axios.post('/auth/login', user)
                const token = res.data.access_token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                localStorage.setItem('token', token)
                commit('setToken', token)
                delete user.password
                commit('login', user)
                commit('clearError')
                router.push('/dashboard')
            } catch (error) {
                //set error
                commit('setIsError', true)
                commit('setError', error.response.data)
            }
        },
        clearErrorAndState: ({ commit }) => {
            commit('clearError')
            commit('clearState')
        },
        getToken: async (context) => {
            if (localStorage.getItem('token')) {
                console.log('token found')
                context.commit('setToken', localStorage.getItem('token'))
                axios.defaults.headers.common['Authorization'] = `Bearer ${context.getters.token}`
                context.dispatch('refreshToken')

            }
        },
        refreshToken: async (context) => {
            try {
                await axios.post('/auth/me')
                //redirect to dashboard
                router.push('/dashboard')
            } catch (error) {
                localStorage.removeItem('token')
                context.dispatch('logout')
                router.push('/')
            }
        }
    }
}

export default auth