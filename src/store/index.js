import { createStore } from 'vuex'
//import axios from 'axios'
//import router from '../router'
//import module login
//import login from './login'
import auth from './modules/auth'
import invoices from './modules/invoices'

export default createStore({

  modules: {
    auth,
    invoices
  }
})

