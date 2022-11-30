<template>
  <div class="routerChild">
    <div class="EditPart">
      <h2>Edit Part</h2>
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
        :options="footprintRef"
        :reduce="(option:selectOptionI<Footprint>)=>option.docRef"
        v-model="partRef.footprint"
      />
      <label for="comment">Comment</label>
      <textarea type="text" name="comment" v-model="partRef.comment"></textarea>

      <label for="status">Status</label>
      <input type="text" name="status" v-model="partRef.status" />

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
import { selectOptionI, categoryTreeRef, footprintRef } from "../staticLists";
import { PartI, PartColRef, PartDocRef } from "../types/part";
import { Category, Footprint, PartParameterEntry } from "../types/types";
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
