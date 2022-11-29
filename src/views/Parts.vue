<template>
  <div class="routerChild">
    <div>
      <button @click="newPart">New Part</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function newPart() {
  router.push("/parts/edit/new");
}
</script>

<style scoped lang="scss">
</style>
