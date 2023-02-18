<script setup lang="ts">
import { RouterView } from "vue-router";
import Loading from "./components/Loading.vue";
</script>

<template>
  <Suspense>
    <RouterView />
    <template #fallback>
      <div class="d-flex justify-center align-center" style="height: 100vh">
        <Loading style="width: 15vw" />
      </div>
    </template>
  </Suspense>
</template>

<style scoped></style>
