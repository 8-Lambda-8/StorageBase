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

export interface UserI {
  name: string;
  permissionLevel: number;
  imgUrl?: string;
  lastOnline?: Timestamp;
  storedParts: Set<StoredPartDocRef>;
  userSettings: UserSettings;
}

interface UserSettings {}

export const UserColRef = collection(db, "User") as CollectionReference<User>;
export type UserDocRef = DocumentReference<User>;

//Permission Classes
//
//0:no Permissions	                  No User
//1:ro		                            Spectator	
//2:create and edit own(default)	    User
//3:create and edit of lower users 	  KeyUser
//4:admin 	                          Admin
//5:superAdmin                        Root
