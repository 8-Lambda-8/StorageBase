<script setup lang="ts">

</script>

<template>
  <header>
    <img class="logo" src="/storagebase.svg" />
    <h1>StorageBase</h1>
  </header>
  <div>
    <nav>
      <router-link to="/">StoredParts</router-link>
      <router-link to="/parts">Parts</router-link>
      <router-link to="/categories">Categories</router-link>
      <router-link to="/storage">Storage Locations</router-link>
      <router-link to="/projects">Projects</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.routerChild {
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
</style>
