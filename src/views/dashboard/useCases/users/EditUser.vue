<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Editar Usuario</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form @submit.prevent="updateUser" class="form">
          <v-text-field v-model="user.user" label="Email" required>
          </v-text-field>

          <v-text-field v-model="user.password" label="Contraseña" required>
          </v-text-field>

          <v-select :items="roles" v-model="user.type" label="Rol">
          </v-select>

          <v-select :items="status" v-model="user.status" label="Estado">
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
  name: 'EditUser',
  data() {
    return {
      id: '',
      user: {
        user: '',
        password: '',
        type: '',
        status: ''
      },
      roles: ['Administrador', 'Lector'],
      status: ['active', 'inactive']
    }
  },
  mounted() {
    axios.get(`${process.env.VUE_APP_URL}/users/${this.$route.params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
        'Content-Type': 'application/json'
      }
    }).then(data => {
      this.user = data.data.fields
    }).catch(console.log)
  },
  methods: {
    async updateUser() {
      let router = this.$router
      try{
        await axios.patch(
          `${process.env.VUE_APP_URL}/users`,
          {
            records: [
              {
                id: this.$route.params.id,
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