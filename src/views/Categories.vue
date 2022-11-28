<template>
  <div class="routerChild">
    <div>
      <button @click="newCategory">New Category</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

function newCategory() {
  router.push("/categories/edit/new");
}
</script>

<style scoped lang="scss">
</style>
