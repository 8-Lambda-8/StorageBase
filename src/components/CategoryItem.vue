<template>
  <div class="wrapper">
    <h4>
      {{ category.name }}
    </h4>
    <a :href="'/categories/edit/' + id">edit</a>
    <CategoryItem
      v-for="categoryLocationDoc in categoriesDocsRef"
      :category="categoryLocationDoc.data()"
      :id="categoryLocationDoc.id"
    />
  </div>
</template>

<script setup lang="ts">
import { QueryDocumentSnapshot, query, where, doc, orderBy, onSnapshot } from "@firebase/firestore";
import { Unsubscribe } from "@firebase/util";
import { ref, onMounted, onUnmounted } from "vue";
import { Category, CategoryColRef } from "../types/types";

const props = defineProps<{
  category: Category;
  id: string;
}>();

const categoriesDocsRef = ref(new Array<QueryDocumentSnapshot<Category>>());

let unsubscribe: Unsubscribe;

onMounted(() => {
  const q = query(
    CategoryColRef,
    where("parentCategory", "==", doc(CategoryColRef, props.id)),
    orderBy("name")
  );

  unsubscribe = onSnapshot(q, (categoryQS) => {
    categoriesDocsRef.value = categoryQS.docs;
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<style scoped lang="scss">
h4 {
  margin: 0.5rem;
}
.wrapper {
  border: 1px black solid;
  margin: 0.3rem 0;
  position: relative;
  div {
    margin-left: 2rem;
    margin-bottom: 0.5rem;
  }
  a {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
