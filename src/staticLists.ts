import { doc, getDoc } from "firebase/firestore";
import { ref } from "vue";
import { db } from "./firebase";

export interface Lists {
  SiPrefix: Map<string, number>;
  Units: string[];
}

console.count("staticListsRun ")
getDoc(doc(db, "Lists", "Lists")).then((snap) => {
  const data = snap.data() as Lists;
  if (!data) return;

  UnitsRef.value = data.Units;
  SiPrefixRef.value = new Map(Object.entries(data.SiPrefix));
  SiPrefixRef.value = new Map([...SiPrefixRef.value.entries()].sort((a, b) => b[1] - a[1]));

  console.log(SiPrefixRef.value);
});

export const SiPrefixRef = ref({} as Map<string, number>);
export const UnitsRef = ref<string[]>([]);
