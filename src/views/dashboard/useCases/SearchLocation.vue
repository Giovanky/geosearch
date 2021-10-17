<template>
  <v-container
    fluid
    tag="section"
  >
    <h2 class="ml-8 display-2 mb-2">Seleccione Ubicacion</h2>
    <v-row justify="center">
      <v-col cols="6">
        <cool-select v-model="selected" :items="nameLocations" />
      </v-col>
      <v-col cols="2">
        <v-btn
          class="container__button"
          @click.prevent="searchLocation(selected)"
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
import { CoolSelect } from "vue-cool-select";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

export default {
  name: "SearchLocation",
  components: {
    CoolSelect,
  },
  data() {
    return {
      forestLocations: [],
      nameLocations: [],
      selected: null,
      loader: new Loader({
        apiKey: process.env.VUE_APP_GOOGLE_APIKEY,
        version: "weekly",
        libraries: ["places"],
      }),
    };
  },
  computed: {},
  methods: {
    async getApiLocations() {
      const data = await axios(`${process.env.VUE_APP_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_APYKEY}`,
        },
      }).catch((err) => console.log(err));
      this.forestLocations = data.data.records;
      this.nameLocations = this.forestLocations.map((lct) => lct.fields.name);
    },

    async defaultMap(location) {
      const { geoX, geoY, name, description } = location;
      const position = { lat: geoX, lng: geoY };
      this.loader
        .load()
        .then(() => {
          const map = new google.maps.Map(document.getElementById("map"), {
            center: position,
            zoom: 15,
          });
          const marker = new google.maps.Marker({
            position,
            map,
          });
          const content = `<h1 class="window__title">${name}<h1/>
          <p class="window__description">${description}<p/>
        `;
          const info = new google.maps.InfoWindow({
            content,
          });
          marker.addListener("click", () => {
            info.open(map, marker);
          });
        })
        .catch((err) => console.log(err));
    },

    initMap(location) {
      const { geoX, geoY, name, description } = location[0].fields;
      const position = { lat: geoX, lng: geoY };
      this.loader
        .load()
        .then(() => {
          const map = new google.maps.Map(document.getElementById("map"), {
            center: position,
            zoom: 15,
          });
          const marker = new google.maps.Marker({
            position,
            map,
          });
          const content = `<h1 class="title">${name}<h1/>
          <p class="window__description">${description}<p/>
        `;
          const info = new google.maps.InfoWindow({
            content,
          });
          marker.addListener("click", () => {
            info.open(map, marker);
          });
        })
        .catch((err) => console.log(err));
    },

    searchLocation(location) {
      if (!location) {
        alert("ingrese ubicacion");
      }
      const filteredLocation = this.forestLocations.filter(
        (lct) => lct.fields.name === this.selected
      );
      this.initMap(filteredLocation);
    },

    async getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              geoX: position.coords.latitude,
              geoY: position.coords.longitude,
              name: "Usted esta aqui!",
              description: "Ubicacion actual",
            };
            this.defaultMap(location);
          },
          (err) => console.log(err),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          }
        );
      } else {
        alert(
          "El navegador no soporta Geolocalizacion, porfavor utilice uno actualizado."
        );
      }
    },
  },

  mounted() {
    this.getLocation();
    this.getApiLocations();
  },
};
</script>

<style>
#map {
  /* position: absolute;
  top: 16rem;
  bottom: 2.8rem; */
  margin: 0 auto;
  z-index: 0;
  height: 60vh;
  width: 90%;
  border-radius: 3px;
  box-shadow: -8px 8px 8px 0px #6666;
}
</style>