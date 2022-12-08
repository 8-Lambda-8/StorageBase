<template>
  <div class="routerChild">
    <div>
      <button @click="editPart('new')">New Part</button>
    </div>
    <table>
      <tr>
        <th>Category</th>
        <th>Name</th>
        <th>Part Nr</th>
        <th>Description</th>
        <th>Footprint</th>
        <th>Status</th>
        <th>Coment</th>
        <th>Actions</th>
      </tr>
      <tr v-for="part of partsDocsRef">
        <td>{{ allCategories.find((c) => c.id == part.data().category?.id)?.data().name }}</td>
        <td>{{ part.data().name }}</td>
        <td>{{ part.data().partNr }}</td>
        <td>{{ part.data().description }}</td>
        <td>{{ allFootprints.find((f) => f.id == part.data().footprint?.id)?.data().name }}</td>
        <td>{{ part.data().status }}</td>
        <td>{{ part.data().comment }}</td>
        <td>
          <button @click="editPart(part.id)">Edit</button>
          <button @click="clonePart(part)">Clone</button>
          <button @click="deletePart(part.id)">Delete</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  query,
  orderBy,
  onSnapshot,
  QueryDocumentSnapshot,
  limit,
  addDoc,
} from "@firebase/firestore";
import { Unsubscribe } from "@firebase/util";
import { onMounted, onUnmounted, ref } from "vue";
import { Part, PartColRef } from "../types/part";
import { allCategories, allFootprints } from "../staticLists";

const router = useRouter();

function editPart(id: string) {
  router.push("/parts/edit/" + id);
}

function clonePart(part: QueryDocumentSnapshot<Part>) {
  addDoc(PartColRef, part.data()).then((docRef) => {
    editPart(docRef.id);
  });
  return;
}

function deletePart(id:string){
  console.log("delete not implemented yet")
}

const partsDocsRef = ref(new Array<QueryDocumentSnapshot<Part>>());

let unsubscribe: Unsubscribe;

onMounted(() => {
  const q = query(PartColRef, orderBy("name"), limit(200));

  unsubscribe = onSnapshot(q, (partQS) => {
    partsDocsRef.value = partQS.docs;
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<style scoped lang="scss">
table {
  margin-top: 2rem;
  box-sizing: border-box;
  border-collapse: collapse;

  td,
  th {
    padding: 0.1rem 0.5rem;
    button {
      width: 4rem;
      margin: auto;
      padding: 0.3rem 0.2rem;
    }
  }
  td:has(button) {
    width: 1%;
    white-space: nowrap;
  }

  th:not(:first-child),
  td:not(:first-child) {
    border-left: solid gray 1px;
  }

  tr:has(th) {
    border-bottom: solid gray 3px;
    background-color: #000000;
    position: sticky;
    top: -1rem;
  }

  tr:nth-child(2n) {
    background-color: #00000033;
  }

  tr:has(td):hover {
    background-color: #00000044;
  }
  th:hover {
    background-color: #ffffff44;
  }
}
</style>
