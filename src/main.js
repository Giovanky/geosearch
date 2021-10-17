import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import firebase from 'firebase/app'
import 'firebase/auth'
import { CoolSelectPlugin } from 'vue-cool-select'
import 'vue-cool-select/dist/themes/material-design.css'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(CoolSelectPlugin)

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FBKEY,
  authDomain: process.env.VUE_APP_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_SENDERID,
  appId: process.env.VUE_APP_APPID
}

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(function(user){
  new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: h => h(App)
  }).$mount('#app')
})