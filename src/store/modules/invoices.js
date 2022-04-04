//vuex store modulo login
import axios from 'axios'
//import router from '../../router'

const auth = {
    state: () => ({
        invoices: [],
        invoicesCopy: [],
        invoice: [],
        isLoading: false,
        error: null,
        isError: false,
        customers: [],
        orderBy: {
            field: '',
            order: 'desc'
        },
    }),
    getters: {
        invoicesCopy: state => state.invoicesCopy,
        orderBy: state => state.orderBy,
        customers: state => state.customers,
        invoices: state => state.invoices,
        invoice: state => state.invoice,
        isLoading: state => state.isLoading,
        error: state => state.error,
        isError: state => state.isError,
    },
    mutations: {
        setInvoicesCopy(state, invoices) {
            state.invoicesCopy = invoices
        },
        setOrderBy(state, orderBy) {
            state.orderBy = orderBy
        },
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
        /**
         *  @description Obtener estructura de una nueva factura   
         * @param {Object} param0 Action context Vuex
         */
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
        /**
         *  @description Obtener todas las facturas
         * @param {Object} param0 Action context Vuex
         */
        async getInvoices({ commit, dispatch }) {
            commit('setLoading', true)
            try {
                const response = await axios.get('/invoices')
                commit('setInvoices', response.data)
                commit('setInvoicesCopy', response.data)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        /**
         *  @description Obtener una factura por id
         * @param {Object} param0 Action context Vuex
         * @param {Number} id Id de la factura
         */
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
        /**
         *  @description Crear una factura
         * @param {Object} param0 Action context Vuex
         * @param {Object} invoice Factura a guardar
         */
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
        /**
         *  @description Actualizar una factura
         * @param {Object} param0 Action context Vuex
         * @param {Object} invoice Factura a actualizar
         */
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
        /**
         *  @description Eliminar una factura
         * @param {Object} param0 Action context Vuex
         * @param {Number} id Id de la factura
         */
        async deleteInvoice({ commit, dispatch }, id) {
            commit('setLoading', true)
            try {
                await axios.delete(`/invoices/${id}`)
            } catch (error) {
                dispatch('error', error)
            }
            commit('setLoading', false)
        },
        /**
         *  @description Añadir un item a la factura seleccionada
         * @param {Object} param0  Action context Vuex
         */
        addInvoiceItem({ commit, getters }) {
            //Add invoice item to invoice
            commit('setLoading', true)
            getters.invoice.invoice_items.push({})
            commit('setLoading', false)
        },
        /**
         *  @description Actualizar un item de la factura seleccionada
         * @param {Object} param0 Action context Vuex
         * @param {Object} param1 Item a actualizar
         */
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
        /**
         *  @description Actualizar el cliente de la factura a crear
         * @param {Object} param0 Action context Vuex
         * @param {Object} invoice Actualizar el cliente de la factura a crear
         */
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
        /**
         *  @description  Actualizar items de la factura a crear
         * @param {Object} param0 Action context Vuex
         * @param {Object} invoice Factura a actualizar
         */
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
        /**
         *  @description Actualizar totales de la factura
         * @param {Object} param0 Action context Vuex
         */
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
        /**
         *  @description Eliminar un item de la factura seleccionada
         * @param {Object} param0 Action context Vuex
         * @param {Number} itemID Id del item a eliminar
         */
        deleteInvoiceItem({ commit, getters, dispatch }, itemID) {
            //delete item invoice
            commit('setLoading', true)
            var invoice_items = getters.invoice.invoice_items.filter(item => item.id !== itemID)
            commit('setInvoice', { ...getters.invoice, invoice_items })
            dispatch('updateTotals')
            commit('setLoading', false)
        },
        /**
         *  @description Ordenar las facturas por campo
         * @param {Object} param0 Action context Vuex
         * @param {Object} param1 Campo y orden de la consulta
         */
        orderByField({ commit, getters }, { field, order }) {
            //if order is null, set order to asc
            if (order == null) {
                order = 'asc'
            }
            //if order is asc, set order to desc
            if (order == 'asc') {
                // if field is the same, set order to desc
                if (getters.orderBy.field == field && getters.orderBy.order == 'asc') {
                    order = 'desc'
                }
            } else {
                //if order is desc, set order to asc
                if (getters.orderBy.field == field && getters.orderBy.order == 'desc') {

                    order = 'asc'
                }
            }

            //order by
            commit('setLoading', true)
            var invoices = getters.invoices
            invoices.sort((a, b) => {
                if (order == 'asc') {
                    //if a[field] is a numerical value
                    if (!isNaN(a[field])) {
                        return a[field] - b[field]
                    } else {
                        if (field.includes(".")) {
                            let field_split = field.split(".")
                            return a[field_split[0]][field_split[1]] > b[field_split[0]][field_split[1]] ? 1 : -1
                        } else {
                            //if a[field] is a string
                            return a[field] > b[field] ? 1 : -1
                        }
                    }
                } else {
                    //if a[field] is a numerical value
                    if (!isNaN(a[field])) {
                        return b[field] - a[field]
                    } else {

                        if (field.includes(".")) {
                            let field_split = field.split(".")
                            return a[field_split[0]][field_split[1]] < b[field_split[0]][field_split[1]] ? 1 : -1
                        } else {
                            return a[field] < b[field] ? 1 : -1
                        }
                    }
                }
            })

            commit('setOrderBy', { field, order })
            commit('setInvoices', invoices)
            commit('setLoading', false)
        },
        /**
         *  @description Filtrar las facturas por campo y valor
         * @param {Object} param0 Action context Vuex
         * @param {Object} param1 Campo y valor de la consulta 
         */
        filterBy({ commit, getters }, { field, value }) {
            commit('setInvoices', getters.invoicesCopy)
            //filter by
            commit('setLoading', true)
            var invoices = getters.invoices
            invoices = invoices.filter(invoice => {
                //if verify if field is a numerical value
                if (!isNaN(invoice[field])) {
                    return invoice[field].toString().includes(value)
                } else {
                    if (field.includes(".")) {
                        let field_split = field.split(".")
                        return invoice[field_split[0]][field_split[1]].toLowerCase().includes(value.toLowerCase())
                    } else {
                        //if field is a string
                        return invoice[field].toLowerCase().includes(value.toLowerCase())
                    }
                }
            })
            commit('setInvoices', invoices)
            commit('setLoading', false)
        },
        /**
         *  @description Limpiar todos los state
         * @param {Object} param0 Action context Vuex
         */
        clearState: ({ commit }) => {
            commit('clearState')
        },
        /**
         *  @description Limpiar los errores
         * @param {Object} param0 Action context Vuex
         */
        clearError: ({ commit }) => {
            commit('clearError')
        },
        /**
         *  @description Error al realizar peticiones
         * @param {Object} param0 Action context Vuex
         * @param {Object} error Error a usar axios
         */
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