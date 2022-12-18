<template>
  <div class="routerChild">
    <div class="EditCategory">
      <h2>Edit Category</h2>
      <label for="name">Name</label>
      <input
        v-model="categoryRef.name"
        type="text"
        name="name"
        maxlength="20"
      >
      <label for="description">Description</label>
      <textarea
        v-model="categoryRef.description"
        type="text"
        name="description"
      />
      <label for="parent">Parent Category</label>
      <v-select
        v-model="categoryRef.parentCategory"
        name="parent"
        :options="categoryTreeRef"
        :reduce="(option:selectOptionI<Category>)=>option.docRef"
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
import { addDoc, doc, onSnapshot, setDoc } from "@firebase/firestore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { selectOptionI, categoryTreeRef } from "../staticLists";
import { Category, CategoryColRef, CategoryDocRef } from "../types/types";

let thisCategoryDocRef: CategoryDocRef;

const categoryRef = ref<Category>({
  name: "",
  description: "",
  parentCategory: null,
});

const idRef = ref("new");
const router = useRouter();

onMounted(async () => {
  const id = useRoute().params.id;

  if (typeof id !== "string") {
    router.push("/category");
    return;
  }
  idRef.value = id;

  thisCategoryDocRef = doc(CategoryColRef, id);

  if (id !== "new" && id.length === 20) {
    onSnapshot(thisCategoryDocRef, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;
      categoryRef.value = data;
    });
  }
});

function apply() {
  if (idRef.value === "new") {
    addDoc(CategoryColRef, categoryRef.value).then((docRef) => {
      thisCategoryDocRef = docRef;
      idRef.value = docRef.id;
      router.push("/categories/edit/" + docRef.id);
    });
    return;
  }

  setDoc(thisCategoryDocRef, categoryRef.value);
}

async function ok() {
  if (idRef.value === "new") {
    await addDoc(CategoryColRef, categoryRef.value);
  } else await setDoc(thisCategoryDocRef, categoryRef.value);
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
