<script setup lang="ts">
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { onMounted, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { UserColRef, userDataRef } from "./types/user";
import { doc, onSnapshot } from "@firebase/firestore";

import UserCard from "./components/UserCard.vue";

const isLogedIn = ref(false);
const userCardExtended = ref(false);

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    console.log("%c" + user?.displayName, "color:green; font-size:2rem");
    console.log("%c" + user?.uid, "color:green; font-size:1rem");

    isLogedIn.value = user != null;
    if (!user) return;
    onSnapshot(doc(UserColRef, user.uid), (userDoc) => {
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      console.log(userData);
      userDataRef.value = userData;
    });
  });
});

function toggleUserCard() {
  userCardExtended.value = !userCardExtended.value;
}
</script>

<template>
  <header>
    <img
      class="logo"
      src="/storagebase.svg"
    >
    <h1>StorageBase</h1>
    <button
      href=""
      class="userBubble"
      :disabled="userDataRef.name == ''"
      @click="toggleUserCard()"
    >
      <img
        :src="userDataRef.imgUrl"
        alt="User Picture"
      >
    </button>
    <UserCard
      v-if="userCardExtended"
      :user="userDataRef"
    />
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

<style scoped lang="scss">
.routerChild {
  overflow-y: auto;
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.userBubble {
  height: 100%;
  aspect-ratio: 1;
  padding: 1px;
  border-radius: 50%;
  overflow: hidden;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
}
.userCard {
  position: absolute;
  top: 4.5rem;
  right: 0.5rem;
  height: 20rem;
  width: 15rem;
}
</style>
