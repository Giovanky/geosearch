<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-3 mb-3">Agregar Ubicacion</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form @submit.prevent="createLocation" class="form">
          <v-text-field v-model="location.name" label="Nombre" required>
          </v-text-field>

          <v-text-field v-model="location.geoX" type="text" label="Latitud" required>
          </v-text-field>

          <v-text-field v-model="location.geoY" type="text" label="Longitud" required>
          </v-text-field>
          
          <v-text-field v-model="location.description" type="text" label="Descripcion" required>
          </v-text-field>

          <v-card-actions>
            <v-btn to="/locations" color="grey" class="mr-4">Cancelar</v-btn>
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
  name: 'CreateLocation',
  data() {
    return {
      location: {
        name: '',
        geoX: 0,
        geoY: 0,
        description: ''
      }
    }
  },
  methods: {
    async createLocation() {
      let router = this.$router
      try{
        const data = await axios.post(
          `${process.env.VUE_APP_URL}/locations`,
          {
            records: [
              {
                fields: {
                  name: this.location.name,
                  geoX: parseFloat(this.location.geoX),
                  geoY: parseFloat(this.location.geoY),
                  description: this.location.description
                }
              }
            ]
          }, {
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
            'Content-Type': 'application/json'
          }})
          console.log(data)
        router.push('/locations')
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>