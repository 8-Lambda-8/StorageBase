<template>
  <div class="wrapper">
    <h4>
      {{ storageLocation.name }}
    </h4>
    <div>
      {{ storageLocation.description }}
    </div>
    <a :href="'/storage/edit/' + id">
      edit
    </a>
  </div>
</template>

<script setup lang="ts">
import { StorageLocation } from "../types/types";

defineProps<{
  storageLocation: StorageLocation;
  id: string;
}>();
</script>

<style scoped lang="scss">
h4 {
  margin: 0.5rem;
}
.wrapper {
  border: 1px black solid;
  margin: 0.3rem 0;
  position: relative;
  div {
    margin-left: 2rem;
    margin-bottom: 0.5rem;
  }
  a {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
