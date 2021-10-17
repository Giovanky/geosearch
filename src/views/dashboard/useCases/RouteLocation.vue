<template>
  <v-container
    fluid
    tag="section"
  >
    <h2 class="ml-8 display-2 mb-2">Seleccione Origen y Destino</h2>
    <v-row justify="center">
      <v-col cols="4">
        <input 
          class="input"
          type="text"
          v-model="origin" 
          ref="autocomplete"
          placeholder="Origen"
        />
      </v-col>
      <v-col cols="4">
        <cool-select v-model="destiny" :items="nameLocations" />
      </v-col>
      <v-col cols="2">
        <v-btn
          class="container__button"
          @click.prevent="calculateRoute(origin, destiny)"
          color="green"
        >
          Buscar
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card-text class="px-0 pb-0">
          <v-sheet>
            <div class="map" id="map"></div>
          </v-sheet>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import { CoolSelect } from 'vue-cool-select'
import axios from 'axios'
import { Loader } from '@googlemaps/js-api-loader'

export default {
  name: 'RouteLocation',
  components: {
    CoolSelect
  },
  data() {
    return {
      forestLocations: [],
      nameLocations: [],
      mergedLocations: [],
      origin: '',
      destiny: '',
      loader: new Loader({
        apiKey: process.env.VUE_APP_GOOGLE_APIKEY,
        version: 'weekly',
        libraries: ['places']
      })
    }
  },

  mounted() {
    this.loader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.$refs['autocomplete'])
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace()
          this.origin = place.formatted_address
        })
    })

    this.getLocation()
    this.getApiLocations()
  },

  methods: {
    async getApiLocations() {
      const data = await axios(`${process.env.VUE_APP_URL}/locations`, {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_APYKEY}`
        }
      }).catch(err => console.log(err))
      this.forestLocations = data.data.records
      this.nameLocations = this.forestLocations.map(lct => lct.fields.name)
    },

    async defaultMap(location) {
      const {geoX, geoY, name, description} = location
      const position = {lat: geoX, lng: geoY}
        this.loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById('map'), {
            center: position,
            zoom: 15,
          })
          const marker = new google.maps.Marker({
            position,
            map,
          })
          const content = `<h1 class="window__title">${name}<h1/>
            <p class="window__description">${description}<p/>
          `
          const info = new google.maps.InfoWindow({
            content
          })
          marker.addListener('click', () => {
            info.open(map, marker)
          })
        }).catch(err => console.log(err))
    },

    calculateRoute(origin, destiny) {
      const filteredDestiny = this.forestLocations.filter(lct => lct.fields.name === this.destiny)
      this.loader.load().then(() => {
        const map = new google.maps.Map(document.getElementById('map'))
        const directionsService = new google.maps.DirectionsService()
        const directionsDisplay = new google.maps.DirectionsRenderer()

        directionsDisplay.setMap(map)

        const request = {
          origin,
          destination: {lat: filteredDestiny[0].fields.geoX, lng: filteredDestiny[0].fields.geoY},
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        }

        directionsService.route(request, (result, status) => {
          if(status === google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(result)
          }else{
            directionsDisplay.setDirections({routes: []})
            alert('No se puede mostrar la distancia')
          }
        })
      }).catch(console.log)
    },

    async getLocation() {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          const location = {
            geoX: position.coords.latitude, 
            geoY: position.coords.longitude,
            name: 'Usted esta aqui!',
            description: 'Ubicacion actual'
          }
          this.defaultMap(location)
        }, err => console.log(err), {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        })
      }else{
        alert('El navegador no soporta Geolocalizacion, porfavor utilice uno actualizado.')
      }
    }

  }
}
</script>

<style lang="scss">
#map {
  margin: 0 auto;
  z-index: 0;
  height: 60vh;
  width: 90%;
  border-radius: 3px;
  box-shadow: -8px 8px 8px 0px #6666;
}
:root{
  --clr-dark: #000000;
  --clr-dark-light: #555555;

  --clr-primary: rgb(69, 235, 83);

  --clr-white: #ffffff;

  --clr-success: #09ff00;
  --clr-danger: #ff0000;
  --clr-loading: #00aeff;

  --brd-default: 1px solid var(--clr-dark);
}
.input{
    background-color: transparent;
    border-radius: .2rem;
    border: none;
    border-bottom: 1px solid var(--clr-dark-light);
    color: var(--clr-dark-light);
    font-size: 1.2rem;
    font-weight: 500;
    padding: .725rem 1.2rem;
    width: 100%;
    transition: border .2s ease-out;

    &:focus{
        outline: none;
        border: 1px solid var(--clr-success); 
    }
    margin: auto auto;
}

.input-sm{
    background-color: transparent;
    border-radius: .3rem;
    border: 1px solid #495057;
    color: #495057;
    font-size: 1.8rem;
    font-weight: 300;
    padding: 1.2rem 1.2rem;
    transition: border .2s ease-out;

    &:focus{
        outline: none;
        border: 1px solid var(--clr-success); 
    }
}
</style>