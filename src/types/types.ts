import {
  Timestamp,
  GeoPoint,
  DocumentReference,
  collection,
  CollectionReference,
} from "firebase/firestore";
import { db } from "../firebase";
import { UserDocRef } from "./user";

export interface Category {
  name: string;
  description: string;
  parentCategory?: CategoryDocRef;
  childCategories: Set<CategoryDocRef>;
}
export const CategoryColRef = collection(db, "Category") as CollectionReference<Category>;
export type CategoryDocRef = DocumentReference<Category>;

export interface StorageLocation {
  owner: UserDocRef;
  location: GeoPoint;
  name: string;
  description: string;
}
export const StorageLocationColRef = collection(
  db,
  "StorageLocation"
) as CollectionReference<StorageLocation>;
export type StorageLocationDocRef = DocumentReference<StorageLocation>;

export interface Parameter {
  name: string;
  unit: Unit;
  value: number;
}

export interface Unit {
  symbol: string;
  name: string;
}

export interface Footprint {
  name: string;
  category: FootprintCategory;
}
export const FootprintColRef = collection(db, "Footprint") as CollectionReference<Footprint>;
export type FootprintDocRef = DocumentReference<Footprint>;

export interface FootprintCategory {
  name: string;
  parentCategory?: FootprintCategoryDocRef;
  childCategories: Set<FootprintCategoryDocRef>;
}
export const FootprintCategoryColRef = collection(
  db,
  "FootprintCategory"
) as CollectionReference<FootprintCategory>;
export type FootprintCategoryDocRef = DocumentReference<FootprintCategory>;

export interface StockHistoryEntry {
  timestamp: Timestamp;
  user: UserDocRef;
  amount: number;
  price: number;
}

export interface Group {
  owner: UserDocRef;
  users: Set<UserDocRef>;
  permissionLevel: number;
}
export const GroupColRef = collection(db, "Group") as CollectionReference<Group>;
export type GroupDocRef = DocumentReference<Group>;
