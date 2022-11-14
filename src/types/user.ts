import { collection, CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { StoredPartDocRef } from "./part";

export class User {
  name: string;
  permissionLevel: number;
  imgUrl?: string;
  lastOnline?: Timestamp;
  storedParts: Set<StoredPartDocRef>;
  userSettings: UserSettings = {};

  constructor(name: string) {
    this.name = name;
    this.permissionLevel = 0;
    this.storedParts = new Set<StoredPartDocRef>();
  }
}

interface UserSettings {}

export const UserColRef = collection(db, "User") as CollectionReference<User>;
export type UserDocRef = DocumentReference<User>;
