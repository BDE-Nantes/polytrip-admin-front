<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import type { VForm } from "../types";
import ApiService from "../services/api.service";

const form = ref<VForm>();
const username = ref("");
const password = ref("");
const snackbar = ref(false);

async function login() {
  form.value!.validate();
  try {
    await ApiService.login(username.value, password.value);
    router.push("/panel");
  } catch {
    snackbar.value = true;
  }
}

const required = (v: string) => !!v || "Champ obligatoire";
</script>

<template>
  <v-container class="h-full d-flex justify-center align-center">
    <v-card class="mx-auto w-30 rounded pa-6" title="Polytrip - connexion">
      <v-form ref="form" class="mt-8">
        <v-text-field
          v-model="username"
          name="login"
          label="Identifiant"
          type="text"
          :rules="[required]"
        ></v-text-field>
        <v-text-field
          v-model="password"
          name="password"
          label="Mot de passe"
          type="password"
          :rules="[required]"
        ></v-text-field>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="login" color="success">Connexion</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-snackbar v-model="snackbar" multi-line>
      Identifiants incorrects
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false"> Fermer </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.w-30 {
  width: 30%;
}

.h-full {
  height: 100vh;
}
</style>
