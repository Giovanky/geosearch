<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-btn to="/users/create" fab dark color="#3FEE3F"><v-icon>mdi-plus</v-icon></v-btn>

    <base-material-card
      icon="mdi-account-multiple"
      title="Lista de Usuarios"
      class="px-5 py-3"
    > 

      <v-simple-table fixed-header class="elevation-3">
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td> {{ user.id }} </td>
            <td> {{ user.fields.user }} </td>
            <td> {{ user.fields.type }} </td>
            <td> {{ user.fields.status }} </td>
            <td>
              <v-btn :to="{name: 'Editar Usuario', params:{id: user.id}}" fab small color="green"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn @click.stop="dialog = true" @click="id = user.id" fab small color="blue-grey darken-4"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr> 

        </tbody>
      </v-simple-table>

    </base-material-card>

    <v-dialog v-model="dialog" max-width="380">
      <v-card>
        <v-card-title>Desea eliminar el usuario?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn @click="deleteUser(id)" color="error">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Users',
  data() {
    return {
      dialog: false,
      id: '',
      users: []
    }
  },
  methods:  {
    async getApiUsers() {
      const data = await axios(`${process.env.VUE_APP_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_APYKEY}`,
        }
      }).catch(err => console.log(err))
      this.users = data.data.records
    },

    async deleteUser(id) {
      let router = this.$router
      try{
        await axios.patch(
          `${process.env.VUE_APP_URL}/users`,
          {
            records: [
              {
                id,
                fields: {
                  status: 'inactive',
                }
              }
            ]
          }, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
            'Content-Type': 'application/json'
          }})
        this.getApiUsers()
        this.dialog = false
      }catch(err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getApiUsers()
  }  
}
</script>