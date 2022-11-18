<template>
  <div class="routerChild">
    <div class="EditStorage">
      <h2>Edit Storage Location</h2>
      <label for="name">Name</label>
      <input type="text" name="name" v-model="storageRef.name" maxlength="20" />
      <label for="description">Description</label>
      <textarea type="text" name="description" v-model="storageRef.description"></textarea>

      <div class="buttons">
        <button @click="ok">OK</button>
        <button @click="cancel">Cancel</button>
        <button @click="apply">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addDoc, doc, GeoPoint, onSnapshot, setDoc } from "@firebase/firestore";
import { auth } from "../firebase";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { StorageLocationColRef, StorageLocationDocRef } from "../types/types";
import { UserColRef } from "../types/user";

let SLDocRef: StorageLocationDocRef;

const storageRef = ref({
  owner: doc(UserColRef, auth.currentUser?.uid ?? "1"),
  location: new GeoPoint(0, 0),
  name: "",
  description: "",
});

const idRef = ref("new");
const router = useRouter();

onMounted(() => {
  const id = useRoute().params.id;

  if (typeof id !== "string") {
    router.push("/storage");
    return;
  }
  idRef.value = id;

  SLDocRef = doc(StorageLocationColRef, id);

  if (id !== "new" && id.length === 20)
    onSnapshot(SLDocRef, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;
      storageRef.value = data;
    });
});

function apply() {
  if (idRef.value === "new") {
    storageRef.value.owner = doc(UserColRef, auth.currentUser?.uid ?? "1");

    addDoc(StorageLocationColRef, storageRef.value).then((docRef) => {
      SLDocRef = docRef;
      idRef.value = docRef.id;
      router.push("/storage/edit/" + docRef.id);
    });
    return;
  }

  setDoc(SLDocRef, storageRef.value);
}

async function ok() {
  if (idRef.value === "new") {
    storageRef.value.owner = doc(UserColRef, auth.currentUser?.uid ?? "1");
    await addDoc(StorageLocationColRef, storageRef.value);
  } else await setDoc(SLDocRef, storageRef.value);
  router.push("/storage");
}

function cancel() {
  router.push("/storage");
}
</script>

<style scoped lang="scss">
.EditStorage {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 20rem;
  textarea {
    min-height: 5rem;
    resize: vertical;
  }
}

.buttons {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  button {
    width: 30%;
  }
}
</style>
