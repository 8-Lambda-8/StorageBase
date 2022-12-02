import {
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { ref } from "vue";
import { db } from "./firebase";
import {
  Category,
  CategoryColRef,
  CategoryDocRef,
  Footprint,
  FootprintColRef,
  PartParameter,
  PartParameterColRef,
} from "./types/types";

// Get SiPrefix and Units
export interface Lists {
  SiPrefix: Map<string, number>;
  Units: string[];
}

getDoc(doc(db, "Lists", "Lists")).then((snap) => {
  const data = snap.data() as Lists;
  if (!data) return;

  UnitsRef.value = data.Units;
  SiPrefixRef.value = new Map(Object.entries(data.SiPrefix));
  SiPrefixRef.value = new Map([...SiPrefixRef.value.entries()].sort((a, b) => b[1] - a[1]));
});

export const SiPrefixRef = ref({} as Map<string, number>);
export const UnitsRef = ref<string[]>([]);

// interface for v-select
export interface selectOptionI<T> {
  label: string;
  docRef: DocumentReference<T> | null;
}

// load Categories
export let allCategories = [] as QueryDocumentSnapshot<Category>[];
export const categoryTreeRef = ref<selectOptionI<Category>[]>([{ label: "Root", docRef: null }]);

onSnapshot(query(CategoryColRef, orderBy("name")), (categoryQS) => {
  allCategories = categoryQS.docs;
  categoryTreeRef.value = [{ label: "Root", docRef: null }];
  getCategoriesRecursive(null, 0);
});

async function getCategoriesRecursive(parentRef: CategoryDocRef | null, level: number) {
  level++;
  const childDocs = allCategories.filter((cat) => cat.data().parentCategory?.id == parentRef?.id);
  for (const [i, catDoc] of childDocs.entries()) {
    const treeSymbol = level == 0 ? "" : i >= childDocs.length - 1 ? "└" : "├";
    categoryTreeRef.value.push({
      label: "│ ".repeat(level - 1) + treeSymbol + catDoc.data().name,
      docRef: catDoc.ref,
    });
    await getCategoriesRecursive(catDoc.ref, level);
  }
}

// load Footprints
export let allFootprints = [] as QueryDocumentSnapshot<Footprint>[];
export const footprintOptionsRef = ref<selectOptionI<Footprint>[]>([
  { label: "None", docRef: null },
]);

onSnapshot(query(FootprintColRef, orderBy("name")), (footprintQS) => {
  allFootprints = footprintQS.docs;
  footprintOptionsRef.value = [{ label: "None", docRef: null }];
  footprintOptionsRef.value.push(
    ...allFootprints.map((f) => ({ label: f.data().name, docRef: f.ref }))
  );
});

// load Parameters
export let allParameters = [] as QueryDocumentSnapshot<PartParameter>[];
export const ParametersOptionsRef = ref<selectOptionI<PartParameter>[]>([
  { label: "-", docRef: null },
]);

onSnapshot(query(PartParameterColRef, orderBy("name")), (parameterQS) => {
  allParameters = parameterQS.docs;
  ParametersOptionsRef.value = [{ label: "-", docRef: null }];
  ParametersOptionsRef.value.push(
    ...allParameters.map((f) => ({ label: f.data().symbol + " - " + f.data().name, docRef: f.ref }))
  );
});
