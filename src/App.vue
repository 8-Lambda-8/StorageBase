<script setup lang="ts">
import { onAuthStateChanged } from "@firebase/auth";
import { onMounted, ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { auth } from "./firebase";
import { UserColRef, UserI } from "./types/user";
import { doc, onSnapshot, Timestamp } from "@firebase/firestore";
import { StoredPartDocRef } from "./types/part";

const isLogedIn = ref(false);
const router = useRouter();

const userDataRef = ref<UserI>({
  name: "",
  permissionLevel: 0,
  imgUrl: "/userIcon.png",
  lastOnline: Timestamp.fromMillis(0),
  storedParts: new Set<StoredPartDocRef>(),
  userSettings: {},
});
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    console.log("%c" + user?.displayName, "color:green; font-size:2rem");
    console.log("%c" + user?.uid, "color:green; font-size:1rem");

    isLogedIn.value = user != null;
    if (!user) {
      router.push("/login");
      return;
    } else if (router.currentRoute.value.path == "/login") {
      router.push("/");
      return;
    }

    onSnapshot(doc(UserColRef, user.uid), (userDoc) => {
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      console.log(userData);
      userDataRef.value = userData;
    });
  });
});
</script>

<template>
  <header>
    <img class="logo" src="/storagebase.svg" />
    <h1>StorageBase</h1>
    <button href="" class="userBubble" @click="toggleUserCard()" :disabled="userDataRef.name == ''">
      <img v-bind:src="userDataRef.imgUrl" alt="User Picture" />
    </button>
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
</style>
