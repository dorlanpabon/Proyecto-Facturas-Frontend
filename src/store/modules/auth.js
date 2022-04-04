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
        /**
         * @description Funcion para iniciar sesion
         * @param {Object} param0 Action context Vuex
         * @param {String} token Token de autenticación
         */
        setToken: ({ commit }, token) => {
            commit('setToken', token)
        },
        /**
         * @description Funcion para salir de sesion
         * @param {Object} param0 Action context Vuex
         */
        logout: ({ commit }) => {
            commit('logout')
            commit('clearState')
            router.push('/')
        },
        /**
         * @description Funcion para autenticar al usuario
         * @param {Object} param0 Action context Vuex
         * @param {Object} user Objeto con los datos del usuario
         */
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
        /**
         * @description Funcion para limpiear el state
         * @param {Object} param0 Action context Vuex
         */
        clearErrorAndState: ({ commit }) => {
            commit('clearError')
            commit('clearState')
        },
        /**
         * @description Funcion para obtener token y validarlo
         * @param {Object} context Action context Vuex
         */
        getToken: async (context) => {
            if (localStorage.getItem('token')) {
                console.log('token found')
                context.commit('setToken', localStorage.getItem('token'))
                axios.defaults.headers.common['Authorization'] = `Bearer ${context.getters.token}`
                context.dispatch('refreshToken')

            }
        },
        /**
         * @description Funcion para refrescar el token
         * @param {Object} context Action context Vuex
         */
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