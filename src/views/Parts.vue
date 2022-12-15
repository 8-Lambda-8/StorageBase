<template>
  <div class="routerChild">
    <div class="tableWrapper">
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
        </tr>
        <tr
          v-for="part of partsDocsRef"
          @click="selectedPartRef = part"
          :class="part === selectedPartRef ? 'selectedRow' : ''"
        >
          <td>{{ allCategories.find((c) => c.id == part.data().category.id)?.data().name }}</td>
          <td>{{ part.data().name }}</td>
          <td>{{ part.data().partNr }}</td>
          <td>{{ part.data().description }}</td>
          <td>{{ allFootprints.find((f) => f.id == part.data().footprint.id)?.data().name }}</td>
          <td>{{ part.data().status }}</td>
        </tr>
      </table>
    </div>
    <div class="PartSidebar" v-if="selectedPartRef">
      <span>
        <button @click="editPart(selectedPartRef?.id ?? '')">Edit</button>
        <button @click="clonePart(selectedPartRef!)">Clone</button>
        <button @click="deletePart(selectedPartRef?.id ?? '')">Delete</button>
      </span>
      <div>
        <h2>
          {{ selectedPartRef.data().name }}
        </h2>
        <p>
          {{ selectedPartRef.data().description }}
        </p>
      </div>

      <table>
        <tr>
          <th>Category:</th>
          <td>
            {{
              allCategories.find((c) => c.id == selectedPartRef?.data().category.id)?.data().name
            }}
          </td>
        </tr>
        <tr>
          <th>Part Nr:</th>
          <td>{{ selectedPartRef.data().partNr }}</td>
        </tr>
        <tr>
          <th>Footprint:</th>
          <td>
            {{
              allFootprints.find((f) => f.id == selectedPartRef?.data().footprint.id)?.data().name
            }}
          </td>
        </tr>
        <tr>
          <th>Status:</th>
          <td>{{ selectedPartRef.data().status }}</td>
        </tr>
        <tr>
          <th>Comment:</th>
          <td>{{ selectedPartRef.data().comment }}</td>
        </tr>
      </table>

      <h3>Parameters:</h3>
      <table>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
        <tr v-for="parameterEntry of selectedPartRef.data().parameters">
          <td>{{ parameterLookup[parameterEntry.parameter.id].symbol }}</td>
          <td>
            {{ parameterEntry.value + " " + parameterLookup[parameterEntry.parameter.id].unit }}
          </td>
        </tr>
      </table>
    </div>
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
import { allCategories, allFootprints, parameterLookup } from "../staticLists";

const router = useRouter();

function editPart(id: string) {
  router.push("/parts/edit/" + id);
}

function clonePart(part: QueryDocumentSnapshot<Part>) {
  if (!part) throw new Error("Tried to clone without selection");
  addDoc(PartColRef, part.data()).then((docRef) => {
    editPart(docRef.id);
  });
  return;
}

function deletePart(id: string) {
  console.log("delete not implemented yet");
}

const partsDocsRef = ref(new Array<QueryDocumentSnapshot<Part>>());
const selectedPartRef = ref<QueryDocumentSnapshot<Part> | null>(null);

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
.routerChild {
  flex-direction: row;
  justify-content: space-between;
}

.tableWrapper {
  table {
    margin-top: 2rem;
    box-sizing: border-box;
    border-collapse: collapse;
    width: 100%;

    td,
    th {
      padding: 0.3rem;
    }

    th:not(:first-child),
    td:not(:first-child) {
      border-left: solid gray 1px;
    }

    tr:has(th) {
      box-shadow: inset 0 -3px gray;
      background-color: #111;
      position: sticky;
      top: -1rem;
    }

    tr:nth-child(2n) {
      background-color: #2a2a2a;
    }

    tr:has(td):hover {
      background-color: #1c1c1c;
    }
    th:hover {
      background-color: #444;
    }
    .selectedRow {
      outline: 1px dotted whitesmoke;
      background-color: #111 !important;
    }
  }

  padding-right: 1rem;
  overflow-y: auto;
  width: 100%;
}

.PartSidebar {
  margin: -1rem;
  margin-left: 0;
  width: 300px;
  padding: 1rem;
  background-color: #1c1c1c;

  span{
    display: grid;
    grid-template-columns: 33% auto auto;
    button{
      padding: .5rem;
    }
  }

  div {
    margin: 1rem -1rem;
    padding: 0.25rem 1rem;
    background-color: #111;
    * {
      margin: 0.5rem 0;
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;
    th,
    td {
      text-align: left;
      padding: 0.25rem;
      width: 50%;
      border: solid 1px #444;
    }
  }
}
</style>
