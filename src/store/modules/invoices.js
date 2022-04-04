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
        customers: [],
    }),
    getters: {
        customers: state => state.customers,
        invoices: state => state.invoices,
        invoice: state => state.invoice,
        isLoading: state => state.isLoading,
        error: state => state.error,
        isError: state => state.isError,
    },
    mutations: {
        setCustomers(state, customers) {
            state.customers = customers
        },
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
        getInvoiceNew: async ({ commit, dispatch }) => {
            commit('setLoading', true)
            //get customers
            try {
                const response = await axios.get('/customers')
                commit('setCustomers', response.data)
                commit('setInvoice',
                    {
                        "id": null,
                        "number": null,
                        "date": null,
                        "customer_nit": null,
                        "seller_nit": null,
                        "total_without_iva": null,
                        "iva": null,
                        "total_with_iva": null,
                        "created_at": null,
                        "updated_at": null,
                        "customer": {},
                        "seller": {},
                        "invoice_items": []
                    })
            } catch (error) {
                dispatch('erorr', error)
            }
            commit('setLoading', false)

        },
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
                await axios.post('/invoices', invoice)
                commit('setInvoice', {})
                dispatch('getInvoices')

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
                dispatch('getInvoices')
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        async deleteInvoice({ commit, dispatch }, id) {
            commit('setLoading', true)
            try {
                await axios.delete(`/invoices/${id}`)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        addInvoiceItem({ commit, getters }) {
            //Add invoice item to invoice
            commit('setLoading', true)
            getters.invoice.invoice_items.push({})
            commit('setLoading', false)
        },
        async updateInvoiceItemId({ commit, getters, dispatch }, { item, index }) {
            //Update invoice item id
            commit('setLoading', true)
            try {
                getters.invoice.invoice_items[index].id = item.id
                console.log("llego")
                //get the item from database
                var res = await axios.get(`/items/${item.item_id}`)
                if (res.data.id) {
                    console.log(res)
                    let invoice = getters.invoice
                    console.log(invoice)
                    invoice.invoice_items[index].item_id = res.data.id
                    invoice.invoice_items[index].description = res.data.description
                    invoice.invoice_items[index].price = res.data.price_sell
                    invoice.invoice_items[index].quantity = 1
                    invoice.invoice_items[index].total = invoice.invoice_items[index].quantity * invoice.invoice_items[index].price
                    invoice.invoice_items[index].id = null
                    invoice.invoice_items[index].invoice_number = null
                    invoice.invoice_items[index].updated_at = null
                    invoice.invoice_items[index].created_at = null

                    console.log(invoice)
                    commit('setInvoice', invoice)

                    dispatch('updateTotals')
                } else {
                    let invoice = getters.invoice
                    invoice.invoice_items[index] = {}
                    commit('setInvoice', invoice)
                }
            } catch (error) {
                console.log(error)
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        updateInvoiceCustomer({ commit, getters }, invoice) {
            //Update invoice customer
            commit('setLoading', true)
            commit('setInvoice', invoice)
            //get the customer of customers 
            getters.customers.forEach(customer => {
                if (customer.nit == invoice.customer_nit) {
                    commit('setInvoice', { ...getters.invoice, customer: customer })
                }
            })
            commit('setLoading', false)
        },
        updateInvoiceItem({ commit, dispatch }, invoice) {
            //update item invoice
            commit('setLoading', true)
            //update invoice item total
            invoice.invoice_items.forEach(item => {
                item.total = (item.quantity * item.price)
                item.total = item.total.toFixed(2)
            })
            dispatch('updateTotals')
            commit('setInvoice', invoice)
            commit('setLoading', false)
        },
        updateTotals({ commit, getters }) {
            //update invoice totals
            commit('setLoading', true)
            var invoice = getters.invoice
            var total = new Number(0);
            invoice.invoice_items.forEach(item => {
                total += parseFloat(item.total)
            })
            invoice.total_with_iva = total.toFixed(2)
            invoice.total_without_iva = (total * 0.81).toFixed(2)
            invoice.iva = (total * 0.19).toFixed(2)
            commit('setInvoice', invoice)
            commit('setLoading', false)
        },
        deleteInvoiceItem({ commit, getters, dispatch }, itemID) {
            //delete item invoice
            commit('setLoading', true)
            var invoice_items = getters.invoice.invoice_items.filter(item => item.id !== itemID)
            commit('setInvoice', { ...getters.invoice, invoice_items })
            dispatch('updateTotals')
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