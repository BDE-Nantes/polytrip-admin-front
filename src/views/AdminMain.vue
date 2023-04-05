<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDataStore } from "@/stores/data";
import L, { GeoJSON, LatLng, Polyline, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import ApiService from "@/services/api.service";

const dataStore = useDataStore();
await dataStore.fetchData();
dataStore.currentTrip = GeoJSON.coordsToLatLngs(dataStore.userInfo!.trip.trip.coordinates);

const snackbar = ref(false);
const snackbarLabel = ref("");
const locationMarker = L.circleMarker([0, 0], { opacity: 0 }).bindPopup("Vous êtes ici");
let startMarker = L.marker(dataStore.currentTrip[0], {
  icon: L.icon({iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"})
}).bindPopup("Départ");
let route = L.polyline(dataStore.currentTrip, { color: dataStore.userInfo?.school_color, weight: 5 });

onMounted(async () => {
  dataStore.map = L.map("map");
  dataStore.map.addLayer(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
  );

  dataStore.map.addLayer(locationMarker);
  dataStore.map.on("locationerror", () => {
    snackbarLabel.value = "Impossible d'obtenir la localisation.";
    snackbar.value = true;
  });
  dataStore.map.on("locationfound", (e) => {
    locationMarker.setLatLng(e.latlng).setStyle({ opacity: 1 });
  });
  dataStore.map.on("click", updateRoute);

  dataStore.map.addLayer(startMarker);
  dataStore.map.addLayer(route);

  dataStore.map.fitBounds(route.getBounds(), { padding: [10, 10] });
  dataStore.map.locate({ watch: true, maxZoom: 10, enableHighAccuracy: true });
});

function updateRoute(e: LeafletMouseEvent) {
  dataStore.map?.removeLayer(route);

  if (dataStore.currentTrip.length === 0) {
    startMarker = L.marker(e.latlng).bindPopup("Départ");
    dataStore.currentTrip.push(e.latlng);
    dataStore.map?.addLayer(startMarker);
  } else {
    dataStore.currentTrip.push(e.latlng);
  }
  route = L.polyline(dataStore.currentTrip, { color: dataStore.userInfo?.school_color, weight: 5 });
  dataStore.map?.addLayer(route);
}

async function sendRoute() {
  try {
    await ApiService.patch(`trips/${dataStore.userInfo?.trip.uuid}/`, {
      trip: { type: "LineString", coordinates: GeoJSON.latLngsToCoords(dataStore.currentTrip) },
    });
    snackbarLabel.value = "Trajet mis à jour avec succès.";
  } catch {
    snackbarLabel.value = "Erreur lors de la mise à jour du trajet.";
  }
  snackbar.value = true;
}

function removeLastPoint() {
  dataStore.map?.removeLayer(route);
  if (dataStore.currentTrip.length === 1) {
    dataStore.map?.removeLayer(startMarker);
  }
  dataStore.currentTrip.pop();
  route = L.polyline(dataStore.currentTrip, { color: dataStore.userInfo?.school_color, weight: 5 });
  dataStore.map?.addLayer(route);
}

function getRouteDistance(route: Polyline) {
  const latLngs = route.getLatLngs() as LatLng[];
  return latLngs.reduce((a, b, i, array) => a + b.distanceTo(array[i + 1] || b), 0);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  location.reload();
}
</script>

<template>
  <v-app>
    <v-app-bar>
      <div class="ml-4">
        {{ dataStore.userInfo?.team_name }}
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="logout" variant="tonal">Déconnexion</v-btn>
    </v-app-bar>
    <v-main>
      <div class="ma-4 d-flex justify-space-between align-center">
        <div class="my-2 d-flex align-center">
          <v-btn
            rounded="lg"
            density="comfortable"
            icon="mdi-undo"
            color="red"
            class="mr-2"
            :disabled="dataStore.currentTrip.length === 2"
            @click="removeLastPoint"
          ></v-btn>
          <v-btn color="green" :disabled="dataStore.currentTrip.length === 1" @click="sendRoute">Metre à jour</v-btn>
        </div>
        <div>
          <p>Distance : {{ Math.round(getRouteDistance(route) / 100) / 10 }} km</p>
        </div>
      </div>
      <div>
        <div id="map" class="ma-4"></div>
      </div>
    </v-main>
    <v-snackbar v-model="snackbar" multi-line>
      {{ snackbarLabel }}
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false"> Fermer </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style>
#map {
  height: 500px;
}
</style>
