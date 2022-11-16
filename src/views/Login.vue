<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ui, uiConfig } from "../firebase";

onMounted(() => {
  ui.start("#firebaseui-auth-container", uiConfig);
});
</script>

<style scoped lang="scss">
#firebaseui-auth-container {
  margin: auto;
}
</style>
