<template>
  <div class="routerChild">
    <div>
      <button @click="newStorage">New Storage Location</button>
    </div>
    <div>
      <StorageItem
        v-for="storageLocationDoc in storageLocationsDocsRef"
        :id="storageLocationDoc.id"
        :key="storageLocationDoc.id"
        :storage-location="storageLocationDoc.data()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  doc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { onMounted, onUnmounted, ref } from "vue";
import { StorageLocation, StorageLocationColRef } from "../types/types";
import { UserColRef } from "../types/user";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

import StorageItem from "../components/StorageItem.vue";
const router = useRouter();

function newStorage() {
  router.push("/storage/edit/new");
}

const storageLocationsDocsRef = ref(new Array<QueryDocumentSnapshot<StorageLocation>>());

let unsubscribe: Unsubscribe;

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (unsubscribe) unsubscribe();

    const q = query(
      StorageLocationColRef,
      where("owner", "==", doc(UserColRef, user?.uid ?? "1")),
      orderBy("name"),
    );

    unsubscribe = onSnapshot(q, (storageLocationQS) => {
      storageLocationsDocsRef.value = storageLocationQS.docs;
    });
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<style scoped lang="scss">
</style>
