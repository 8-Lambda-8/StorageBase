<template>
  <div class="routerChild">
    <div class="EditPart">
      <h2>Edit Part</h2>
      <div class="columns">
        <div class="col">
          <label for="name"> Name </label>
          <input
            v-model="partRef.name"
            type="text"
            name="name"
            maxlength="20"
          >
          <label for="partNr"> Part Number </label>
          <input
            v-model="partRef.partNr"
            type="text"
            name="partNr"
          >
          <label for="description"> Description </label>
          <input
            v-model="partRef.description"
            type="text"
            name="description"
          >
          <label for="category"> Category </label>
          <v-select
            v-model="partRef.category"
            name="category"
            :options="categoryTreeRef"
            :reduce="(option:selectOptionI<Category>)=>option.docRef"
          />
          <label for="footprint"> Footprint </label>
          <v-select
            v-model="partRef.footprint"
            name="footprint"
            :options="footprintOptionsRef"
            :reduce="(option:selectOptionI<Footprint>)=>option.docRef"
          />
          <label for="comment"> Comment </label>
          <textarea
            v-model="partRef.comment"
            type="text"
            name="comment"
          />

          <label for="status"> Status </label>
          <input
            v-model="partRef.status"
            type="text"
            name="status"
          >
        </div>
        <div
          class="col"
          style="width: 100%"
        >
          <div class="parameter">
            <h3>Parameters:</h3>

            <label for="parameterType"> Add Parameter: </label>
            <div class="addParameter">
              <v-select
                v-model="selectedRef"
                name="parameterType"
                :options="ParametersOptionsRef"
                :reduce="(option:selectOptionI<PartParameter>)=>option.docRef"
                x="filter used parameters"
              />
              <button @click="addParameter">Add</button>
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
                  <tr
                    v-for="param of partRef.parameters"
                    :key="param.parameter.id"
                  >
                    <td>
                      <SymbolFormat :param-id="param.parameter.id" />
                    </td>
                    <td>
                      <input
                        v-model="param.value"
                        type="number"
                        name="value"
                      >
                      <select
                        v-model="param.prefix"
                        name="si"
                      >
                        <option
                          v-for="si in SiPrefixRef"
                          :key="si[0]"
                          :selected="si[0] == '-'"
                          :value="si[0]"
                        >
                          {{ si[0] }}
                        </option>
                      </select>
                      {{ parameterLookup[param.parameter.id].unit }}
                    </td>
                    <td>
                      {{ "±" }}
                      <input
                        v-model="param.tolerance"
                        type="number"
                        name="tolerance"
                      >
                      {{ param.tolerancePercent ? "%" : "" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectOptionI,
  categoryTreeRef,
  footprintOptionsRef,
  ParametersOptionsRef,
  parameterLookup,
  SiPrefixRef,
} from "../staticLists";
import { PartI, PartColRef, PartDocRef } from "../types/part";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Category,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Footprint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PartParameter,
  PartParameterDocRef,
  PartParameterEntry,
} from "../types/types";
import { UserColRef } from "../types/user";
import SymbolFormat from "../components/SymbolFormat.vue";

let thisPartDocRef: PartDocRef;

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

  thisPartDocRef = doc(PartColRef, id);

  if (id !== "new" && id.length === 20) {
    onSnapshot(thisPartDocRef, (docSnap) => {
      const data = docSnap.data();
      if (!data) return;
      partRef.value = data;
    });
  }
});

function addParameter() {
  if (selectedRef.value == null) {
    console.log("cannotAdd");
    return;
  }

  partRef.value.parameters.push({
    parameter: selectedRef.value,
    value: 0,
    prefix: "-",
    tolerance: 0,
    tolerancePercent: true,
  } as PartParameterEntry);
}

function apply() {
  if (idRef.value === "new") {
    addDoc(PartColRef, partRef.value).then((docRef) => {
      thisPartDocRef = docRef as PartDocRef;
      idRef.value = docRef.id;
      router.push("/parts/edit/" + docRef.id);
    });
    return;
  }

  setDoc(thisPartDocRef, partRef.value);
}

async function ok() {
  if (idRef.value === "new") {
    await addDoc(PartColRef, partRef.value);
  } else await setDoc(thisPartDocRef, partRef.value);
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
  width: 20rem;
  textarea {
    min-height: 5rem;
    resize: vertical;
  }
}
.columns {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
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
  font-size: 0.9em;
  box-sizing: border-box;
  border-collapse: collapse;
  width: 100%;

  th:first-child {
    width: 25%;
  }

  th:not(:first-child),
  td:not(:first-child) {
    border-left: solid black 1px;
    text-align: center;
  }

  td {
    input {
      width: 4rem;
    }
    select {
      width: 2rem;
    }
  }
  td:last-child {
    input {
      width: 3rem;
    }
  }

  tr:has(th) {
    border-bottom: solid black 3px;
  }

  tr:nth-child(2n) {
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
