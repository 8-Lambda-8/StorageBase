<template>
  <div class="userCard">
    <img :src="user?.imgUrl">
    <div>
      <p>{{ user?.name }}</p>
      <p>PermissionLevel:{{ user?.permissionLevel }}</p>
    </div>

    <div />
    <!-- <button @click="useRouter().push("/settings")">Settings</button> -->
    <button @click="getAuth().signOut()">
      LogOut
    </button>
  </div>
</template>

<script setup lang="ts">
import { getAuth } from "@firebase/auth";
import { UserI } from "../types/user";

defineProps<{
  user: UserI;
}>();
</script>

<style scoped lang="scss">
.userCard {
  z-index: 999;
  background-color: #8a817cff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  overflow: hidden;
  div::first-line {
    font-size: 2rem;
  }
}
img {
  height: 6rem;
  width: 6rem;
  border-radius: 50%;
}
</style>
