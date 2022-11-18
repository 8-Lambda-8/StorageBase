import { collection, CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { StoredPartDocRef } from "./part";
import { GroupDocRef, StorageLocationDocRef } from "./types";

export class User {
  name: string;
  permissionLevel: number;
  imgUrl?: string;
  lastOnline?: Timestamp;
  storedParts: Set<StoredPartDocRef>;
  storageLocations: Set<StorageLocationDocRef>;
  owningGroups: Set<GroupDocRef>;
  groups: Set<GroupDocRef>;
  userSettings: UserSettings = {};

  constructor(name: string) {
    this.name = name;
    this.permissionLevel = 0;
    this.storedParts = new Set<StoredPartDocRef>();
    this.storageLocations = new Set<StorageLocationDocRef>();
    this.groups = new Set<GroupDocRef>();
    this.owningGroups = new Set<GroupDocRef>();
  }

  getJSON(): UserI {
    return {
      name: this.name,
      permissionLevel: this.permissionLevel,
      imgUrl: this.imgUrl,
      lastOnline: this.lastOnline,
      storedParts: this.storedParts,
      storageLocations: this.storageLocations,
      groups: this.groups,
      owningGroups: this.owningGroups,
      userSettings: this.userSettings,
    };
  }
}

export interface UserI {
  name: string;
  permissionLevel: number;
  imgUrl?: string;
  lastOnline?: Timestamp;
  storedParts: Set<StoredPartDocRef>;
  storageLocations: Set<StorageLocationDocRef>;
  groups: Set<GroupDocRef>;
  owningGroups: Set<GroupDocRef>;
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
