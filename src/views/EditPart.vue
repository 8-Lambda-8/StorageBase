<template>
  <div class="routerChild">
    <div class="EditPart">
      <h2>Edit Part</h2>
      <div class="columns">
        <div class="col">
          <label for="name">Name</label>
          <input type="text" name="name" v-model="partRef.name" maxlength="20" />
          <label for="partNr">Part Number</label>
          <input type="text" name="partNr" v-model="partRef.partNr" />
          <label for="description">Description</label>
          <input type="text" name="description" v-model="partRef.description" />
          <label for="category">Category</label>
          <v-select
            name="category"
            :options="categoryTreeRef"
            :reduce="(option:selectOptionI<Category>)=>option.docRef"
            v-model="partRef.category"
          />
          <label for="footprint">Footprint</label>
          <v-select
            name="footprint"
            :options="footprintOptionsRef"
            :reduce="(option:selectOptionI<Footprint>)=>option.docRef"
            v-model="partRef.footprint"
          />
          <label for="comment">Comment</label>
          <textarea type="text" name="comment" v-model="partRef.comment"></textarea>

          <label for="status">Status</label>
          <input type="text" name="status" v-model="partRef.status" />
        </div>
        <div class="col">
          <div class="parameter">
            <h3>Parameters:</h3>

            <label for="parameterType">Add Parameter:</label>
            <div class="addParameter">
              <v-select
                name="parameterType"
                :options="ParametersOptionsRef"
                :reduce="(option:selectOptionI<PartParameter>)=>option.docRef"
                v-model="selectedRef"
              />
              <button>Add</button>
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Tol.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {{ "Name" }}
                    </td>
                    <td>
                      <input type="number" name="value" value="10" />
                      <select name="si">
                        <option v-for="si in SiPrefixRef" :selected="si[1] == 0" :value="si">
                          {{ si[0] }}
                        </option>
                      </select>
                      {{ "Ω" }}
                    </td>
                    <td>
                      {{ "±" }}
                      <input type="number" name="tolerance" value="2" />
                      {{ "%" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="parameterList"></div>
          </div>
        </div>
      </div>

      <div class="buttons">
        <button @click="ok">OK</button>
        <button @click="cancel">Cancel</button>
        <button @click="apply">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth } from "@firebase/auth";
import { addDoc, doc, onSnapshot, setDoc, Timestamp } from "@firebase/firestore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  selectOptionI,
  categoryTreeRef,
  footprintOptionsRef,
  ParametersOptionsRef,
  SiPrefixRef,
} from "../staticLists";
import { PartI, PartColRef, PartDocRef } from "../types/part";
import {
  Category,
  Footprint,
  PartParameter,
  PartParameterDocRef,
  PartParameterEntry,
} from "../types/types";
import { UserColRef } from "../types/user";

let PartDocRef: PartDocRef;

const partRef = ref<PartI>({
  name: "",
  partNr: "",
  description: "",
  category: null,
  footprint: null,
  comment: "",
  status: "",
  parameters: new Array<PartParameterEntry>(),
  lastChange: Timestamp.now(),
  lastChangeUser: doc(UserColRef, getAuth().currentUser?.uid ?? "1"),
});

const idRef = ref("new");
const router = useRouter();

const selectedRef = ref<PartParameterDocRef | null>(null);

onMounted(async () => {
  const id = useRoute().params.id;

  if (typeof id !== "string") {
    router.push("/Part");
    return;
  }
  idRef.value = id;

  PartDocRef = doc(PartColRef, id);

  if (id !== "new" && id.length === 20)
    onSnapshot(PartDocRef, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;
      partRef.value = data;
    });
});

function apply() {
  if (idRef.value === "new") {
    addDoc(PartColRef, partRef.value).then((docRef) => {
      PartDocRef = docRef as PartDocRef;
      idRef.value = docRef.id;
      router.push("/parts/edit/" + docRef.id);
    });
    return;
  }

  setDoc(PartDocRef, partRef.value);
}

async function ok() {
  if (idRef.value === "new") {
    await addDoc(PartColRef, partRef.value);
  } else await setDoc(PartDocRef, partRef.value);
  router.push("/parts");
}

function cancel() {
  router.push("/parts");
}
</script>

<style scoped lang="scss">
.EditPart {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 30rem;
  textarea {
    min-height: 5rem;
    resize: vertical;
  }
}
.columns {
  display: flex;
  flex-direction: row;
}
.col {
  display: flex;
  flex-direction: column;
  min-width: 30%;
  margin: 4px;
}
.addParameter {
  display: flex;
  flex-direction: row;
  .v-select {
    width: 100%;
  }
}
.parameter > div:has(table) {
  border-radius: 8px;
  margin-top: 0.3rem;
  padding: 0.5em;
  box-sizing: border-box;
  background-color: #ffffff55;
  border: 2px solid #1a1a1a;
}

table {
  color: black;
  font-size: 0.9em;
  box-sizing: border-box;
  border-collapse: collapse;

  th {
    width: 33%;
  }

  th:not(:first-child),
  td:not(:first-child) {
    border-left: solid black 1px;
    text-align: center;
  }

  tr:has(th) {
    border-bottom: solid black 3px;
  }

  tr:nth-child(2) {
    background-color: #00000033;
  }
  input,
  select {
    background-color: transparent;
    border: initial;
    border-radius: 0;
    width: 33%;
    padding: 0;
    text-align: right;
  }
  input:focus,
  select:focus {
    outline: none;
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
