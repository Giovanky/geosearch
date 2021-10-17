<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Editar Ubicacion</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form @submit.prevent="updateLocation" class="form">
          <v-text-field v-model="location.name" label="Nombre" required>
          </v-text-field>

          <v-text-field v-model="location.geoX" label="Latitud" required>
          </v-text-field>

          <v-text-field v-model="location.geoY" label="Longitud" required>
          </v-text-field>

          <v-text-field v-model="location.description" label="Descripción" required>
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
  name: 'EditLocation',
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
  mounted() {
    axios.get(`${process.env.VUE_APP_URL}/locations/${this.$route.params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
        'Content-Type': 'application/json'
      }
    }).then(data => {
      this.location = data.data.fields
    }).catch(console.log)
  },
  methods: {
    async updateLocation() {
      let router = this.$router
      try{
        await axios.patch(
          `${process.env.VUE_APP_URL}/locations`,
          {
            records: [
              {
                id: this.$route.params.id,
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
        router.push('/locations')
      }catch(err) {
        console.log(err)
      }
    }
  }
}
</script>