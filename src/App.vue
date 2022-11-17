<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { onMounted, ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { auth } from "./firebase";

const isLogedIn = ref(false);
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    console.log("%c" + user?.displayName, "color:green; font-size:2rem");

    isLogedIn.value = user != null;
    if (!user) {
      router.push("/login");
    } else if (router.currentRoute.value.path == "/login") {
      router.push("/");
    }
  });
});
</script>

<template>
  <header>
    <img class="logo" src="/storagebase.svg" />
    <h1>StorageBase</h1>
  </header>
  <div>
    <nav v-if="isLogedIn">
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
