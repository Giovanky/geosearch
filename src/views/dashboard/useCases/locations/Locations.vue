<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <v-btn to="/locations/create" fab dark color="#3FEE3F"><v-icon>mdi-plus</v-icon></v-btn>

    <base-material-card
      icon="mdi-account-multiple"
      title="Lista de Ubicaciones"
      class="px-5 py-3"
    > 

      <v-simple-table fixed-header class="elevation-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in locations" :key="location.id">
            <td> {{ location.fields.name }} </td>
            <td> {{ location.fields.geoX }} </td>
            <td> {{ location.fields.geoY }} </td>
            <td> {{ location.fields.description }} </td>
            <td>
              <v-btn :to="{name: 'Editar Ubicacion', params:{id: location.id}}" fab small color="green"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn @click.stop="dialog = true" @click="id = location.id" fab small color="blue-grey darken-4"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr> 

        </tbody>
      </v-simple-table>

    </base-material-card>

    <v-dialog v-model="dialog" max-width="380">
      <v-card>
        <v-card-title>Desea eliminar la Ubicacion?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn @click="deleteLocation(id)" color="error">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Locations',
  data() {
    return {
      dialog: false,
      id: '',
      locations: []
    }
  },
  methods:  {
    async getApiLocations() {
      const data = await axios(`${process.env.VUE_APP_URL}/locations`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_APYKEY}`,
        }
      }).catch(err => console.log(err))
      this.locations = data.data.records
    },

    async deleteLocation(id) {
      try{
        await axios.delete(
          `${process.env.VUE_APP_URL}/locations`,
          {
            records: [
              {
                id
              }
            ]
          }, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
            'Content-Type': 'application/json'
          }})
        this.getApiLocations()
        this.dialog = false
      }catch(err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getApiLocations()
  }  
}
</script>