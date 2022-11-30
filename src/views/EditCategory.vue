<template>
  <div class="routerChild">
    <div class="EditCategory">
      <h2>Edit Category</h2>
      <label for="name">Name</label>
      <input type="text" name="name" v-model="categoryRef.name" maxlength="20" />
      <label for="description">Description</label>
      <textarea type="text" name="description" v-model="categoryRef.description"></textarea>
      <label for="parent">Parent Category</label>
      <v-select
        name="parent"
        :options="categoryTreeRef"
        :reduce="(option:selectOptionI<Category>)=>option.docRef"
        v-model="categoryRef.parentCategory"
      />

      <div class="buttons">
        <button @click="ok">OK</button>
        <button @click="cancel">Cancel</button>
        <button @click="apply">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  addDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
} from "@firebase/firestore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { selectOptionI, categoryTreeRef } from "../staticLists";
import { Category, CategoryColRef, CategoryDocRef } from "../types/types";

let CategoryDocRef: CategoryDocRef;

const categoryRef = ref<Category>({
  name: "",
  description: "",
  parentCategory: null,
});

let allCat = [] as QueryDocumentSnapshot<Category>[];

const idRef = ref("new");
const router = useRouter();

onMounted(async () => {
  const id = useRoute().params.id;

  if (typeof id !== "string") {
    router.push("/category");
    return;
  }
  idRef.value = id;

  CategoryDocRef = doc(CategoryColRef, id);

  if (id !== "new" && id.length === 20)
    onSnapshot(CategoryDocRef, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;
      categoryRef.value = data;
    });
});

function apply() {
  if (idRef.value === "new") {
    addDoc(CategoryColRef, categoryRef.value).then((docRef) => {
      CategoryDocRef = docRef;
      idRef.value = docRef.id;
      router.push("/categories/edit/" + docRef.id);
    });
    return;
  }

  setDoc(CategoryDocRef, categoryRef.value);
}

async function ok() {
  if (idRef.value === "new") {
    await addDoc(CategoryColRef, categoryRef.value);
  } else await setDoc(CategoryDocRef, categoryRef.value);
  router.push("/categories");
}

function cancel() {
  router.push("/categories");
}
</script>

<style scoped lang="scss">
.EditCategory {
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
