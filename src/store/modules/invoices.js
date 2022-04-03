//vuex store modulo login
import axios from 'axios'
//import router from '../../router'

const auth = {
    state: () => ({
        invoices: [],
        invoice: [],
        isLoading: false,
        error: null,
        isError: false,
    }),
    getters: {
        invoices: state => state.invoices,
        invoice: state => state.invoice,
        isLoading: state => state.isLoading,
        error: state => state.error,
        isError: state => state.isError,
    },
    mutations: {
        setInvoices: (state, invoices) => {
            state.invoices = invoices
        },
        setInvoice: (state, invoice) => {
            state.invoice = invoice
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
            state.invoices = []
            state.invoice = []
            state.isLoading = false
            state.error = null
            state.isError = false
        }
    },
    actions: {
        //actions invoices
        async getInvoices({ commit, dispatch }) {
            commit('setLoading', true)
            try {
                const response = await axios.get('/invoices')
                commit('setInvoices', response.data)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        async getInvoice({ commit, dispatch }, id) {
            commit('setInvoice', [])
            commit('setLoading', true)
            try {
                const response = await axios.get(`/invoices/${id}`)
                commit('setInvoice', response.data)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        async createInvoice({ commit, dispatch }, invoice) {
            commit('setLoading', true)
            try {
                const response = await axios.post('/invoices', invoice)
                commit('setInvoice', response.data)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        async updateInvoice({ commit, dispatch }, invoice) {
            commit('setLoading', true)
            try {
                const response = await axios.put(`/invoices/${invoice.id}`, invoice)
                commit('setInvoice', response.data)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        async deleteInvoice({ commit, dispatch }, id) {
            commit('setLoading', true)
            try {
                await axios.delete(`/invoices/${id}`)
                //commit('clearState')
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        clearState: ({ commit }) => {
            commit('clearState')
        },
        clearError: ({ commit }) => {
            commit('clearError')
        },
        error: ({ commit, dispatch }, error) => {
            //verify status code 401 unauthorized
            if (error.response.status === 401) {
                dispatch('logout')
            } else {
                commit('setError', error.message)
                commit('setIsError', true)
            }
        }
    }
}

export default auth