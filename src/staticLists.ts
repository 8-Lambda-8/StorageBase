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
import { Category, CategoryColRef, CategoryDocRef } from "./types/types";

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

export interface selectOptionI<T> {
  name: string;
  docRef: DocumentReference<T> | null;
}

export let allCategories = [] as QueryDocumentSnapshot<Category>[];
export const categoryTreeRef = ref<selectOptionI<Category>[]>([
  { name: "Root", docRef: null },
]);

onSnapshot(query(CategoryColRef, orderBy("name")), (categoryQS) => {
  allCategories = categoryQS.docs;
  categoryTreeRef.value = [{ name: "Root", docRef: null }];
  getCategoriesRecursive(null, 0);
});

async function getCategoriesRecursive(parentRef: CategoryDocRef | null, level: number) {
  level++;
  const childDocs = allCategories.filter((cat) => cat.data().parentCategory?.id == parentRef?.id);
  for (const [i, catDoc] of childDocs.entries()) {
    const treeSymbol = level == 0 ? "" : i >= childDocs.length - 1 ? "└" : "├";
    categoryTreeRef.value.push({
      name: "│ ".repeat(level - 1) + treeSymbol + catDoc.data().name,
      docRef: catDoc.ref,
    });
    await getCategoriesRecursive(catDoc.ref, level);
  }
}
