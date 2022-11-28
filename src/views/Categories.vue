<template>
  <div class="routerChild">
    <div v-if="userDataRef.permissionLevel > 3">
      <button @click="newCategory">New Category</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { userDataRef } from "../types/user";
const router = useRouter();

function newCategory() {
  router.push("/categories/edit/new");
}
</script>

<style scoped lang="scss">
</style>
