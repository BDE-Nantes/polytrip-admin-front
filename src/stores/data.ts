import { defineStore } from "pinia";
import type { UserInfo } from "@/types";
import ApiService from "../services/api.service";
import type { Map, LatLng } from "leaflet";

export const useDataStore = defineStore("data", {
  state: () => {
    return {
      currentTrip: [] as LatLng[],
      userInfo: null as UserInfo | null,
      map: null as Map | null,
    };
  },
  actions: {
    async fetchData() {
      this.userInfo = await ApiService.get("users/me/");
    },
  },
});
