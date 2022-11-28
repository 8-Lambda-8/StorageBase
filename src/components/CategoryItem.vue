<template>
  <div class="wrapper">
    <h4>
      {{ category.name }}
    </h4>
    <a :href="'/categories/edit/' + id">edit</a>
  </div>
</template>

<script setup lang="ts">
import { Category } from "../types/types";

const props = defineProps<{
  category: Category;
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
