<template>
  <div class="routerChild">
    <div>
      <button @click="newStorage">New Storage Location</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

function newStorage() {
    router.push("/storage/edit/new");
}


</script>

<style scoped lang="scss">
</style>
