<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-3 mb-3">Crear Usuario</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form @submit.prevent="createUser" class="form">
          <v-text-field v-model="user.user" label="Email" required>
          </v-text-field>

          <v-text-field v-model="user.password" type="password" label="Contraseña" required>
          </v-text-field>

          <v-select :items="roles" v-model="user.type" label="Rol">
          </v-select>
          <v-card-actions>
            <v-btn to="/users" color="grey" class="mr-4">Cancelar</v-btn>
            <v-btn type="submit" color="green" class="mr-4">Guardar</v-btn>
          </v-card-actions>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CreateUser',
  data() {
    return {
      user: {
        user: '',
        password: '',
        type: '',
        status: 'active'
      },
      roles: ['Administrador', 'Lector']
    }
  },
  methods: {
    async createUser() {
      let router = this.$router
      try{
        await axios.post(
          `${process.env.VUE_APP_URL}/users`,
          {
            records: [
              {
                fields: {
                  user: this.user.user,
                  password: this.user.password,
                  type: this.user.type,
                  status: this.user.status
                }
              }
            ]
          }, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
            'Content-Type': 'application/json'
          }})
        router.push('/users')
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>