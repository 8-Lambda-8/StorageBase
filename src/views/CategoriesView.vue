<template>
  <div class="routerChild">
    <div v-if="userDataRef.permissionLevel > 3">
      <button @click="newCategory">
        New Category
      </button>
    </div>
    <div>
      <CategoryItem
        v-for="categoryLocationDoc in categoriesDocsRef"
        :id="categoryLocationDoc.id"
        :key="categoryLocationDoc.id"
        :category="categoryLocationDoc.data()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { QueryDocumentSnapshot, query, where, orderBy, onSnapshot } from "@firebase/firestore";
import { Unsubscribe } from "@firebase/util";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Category, CategoryColRef } from "../types/types";
import { userDataRef } from "../types/user";

import CategoryItem from "../components/CategoryItem.vue";
const router = useRouter();

function newCategory() {
  router.push("/categories/edit/new");
}

const categoriesDocsRef = ref(new Array<QueryDocumentSnapshot<Category>>());

let unsubscribe: Unsubscribe;

onMounted(() => {
  const q = query(CategoryColRef, where("parentCategory", "==", null), orderBy("name"));

  unsubscribe = onSnapshot(q, (categoryQS) => {
    categoriesDocsRef.value = categoryQS.docs;
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<style scoped lang="scss">
</style>
