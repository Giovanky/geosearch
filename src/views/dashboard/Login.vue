<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center green--text display-4" 
                        >Ingresar a Geosearch!</h1>
                        
                        <h4 class="text-center grey--text mt-4">Ingresa tu Email para ingresar</h4>
                        <v-form>
                          <v-text-field
                            label="Email"
                            name="email"
                            type="email"
                            color="green accent-3"
                            v-model="email"
                            required
                          />

                          <v-text-field
                            id="password"
                            label="Contraseña"
                            name="password"
                            type="password"
                            color="green accent-3"
                            v-model="password"
                            required
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-3">
                        <v-btn rounded color="green accent-3" class="mb-4" dark @click="login">Iniciar Sesion</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="green accent-3">
                      <v-card-text class="white--text mt-2">
                        <h1 class="text-center display-2 mb-2 font-weight-bold">Hola!</h1>
                        <h5
                          class="text-center display-1 font-weight-bold"
                        >Si no tienes una cuenta registrate aqui!</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step++" class="mb-4">Registrarse</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="green accent-3">
                      <v-card-text class="white--text mt-4">
                        <h1 class="text-center display-2 mb-2 font-weight-bold">Bienvenido!</h1>
                        <h5
                          class="text-center display-1 font-weight-bold"
                        >Si ya tienes una cuenta puedes iniciar sesion aqui!</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">Iniciar Sesion</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-4 green--text text--accent-3">Registrarse</h1>
                        <h4 class="text-center grey--text mt-4">Ingresa tu Email para registrarte</h4>
                        <v-form>
                          <v-text-field
                            label="Email"
                            name="Email"
                            type="email"
                            color="green accent-3"
                            v-model="reemail"
                            required
                          />

                          <v-text-field
                            id="password"
                            label="Contraseña"
                            name="password"
                            type="password"
                            color="green accent-3"
                            v-model="repassword"
                            required
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="green accent-3" class="mb-4" @click="register" dark>Registrarse</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'

export default {
  name: 'Login',  
  data() {
    return {
      users: [],
      step: 1,
      email: '',
      password: '',
      reemail: '',
      repassword: ''
    }
  },
  mounted() {
    this.getApiUsers()
  },
  methods: {
    ...mapActions(['saveUser']),

    async getApiUsers() {
      const data = await axios(`${process.env.VUE_APP_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_APYKEY}`,
        }
      }).catch(err => console.log(err))
      this.users = data.data.records
    },

    async login() {
      const accountExist = this.users.filter(user => user.fields.user === this.email)
      if(accountExist.length === 0){
        alert('correo o contraseña erronea')
        this.reemail = ''
        this.repassword = ''
        return
      }
      if(accountExist[0].fields.password === this.password){
        if(accountExist[0].fields.status === 'inactive'){
          alert('cuenta desabilitada')
          this.reemail = ''
          this.repassword = ''
          return
        }
        this.saveUser(accountExist[0].fields.user)
        return
      }
      alert('correo o contraseña erronea')
      return
    },

    async register() {
      if(!this.reemail && !this.repassword) {
        alert('Formulario vacio')
        return
      }
      const emailExist = this.users.filter(user => user.fields.user === this.reemail)
      console.log(emailExist)
      if(emailExist.length === 0){
        try{
          await axios.post(
            `${process.env.VUE_APP_URL}/users`,
            {
              records: [
                {
                  fields: {
                    user: this.reemail,
                    password: this.repassword,
                    type: 'Lector',
                    status: 'active'
                  }
                }
              ]
            }, {
            headers: {
              Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
              'Content-Type': 'application/json'
            }})
          this.getApiUsers()
          this.step = 1
        }catch(err) {
          console.log(err)
        }
      }else{
        alert('Usuario ya registrado')
        this.reemail = ''
        this.repassword = ''
        return
      }
    }
  }
}
</script>