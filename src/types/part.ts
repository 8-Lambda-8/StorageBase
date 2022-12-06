import { UserDocRef } from "./user";
import { CategoryDocRef, FootprintDocRef, PartParameterEntry } from "./types";
import { Timestamp, CollectionReference, DocumentReference, collection } from "firebase/firestore";
import { GroupDocRef, StockHistoryEntry, StorageLocationDocRef } from "./types";
import { db } from "../firebase";

export interface PartI {
  name: string;
  partNr: string;
  description: string;
  category: CategoryDocRef | null;
  footprint: FootprintDocRef | null;
  comment: string;
  status: string;
  parameters: Array<PartParameterEntry>;
  lastChange: Timestamp;
  lastChangeUser: UserDocRef;
}

export class Part {
  name: string;
  partNr: string;
  description: string;
  comment: string;
  status: string;
  parameters: Array<PartParameterEntry>;
  footprint: FootprintDocRef;
  lastChange: Timestamp;
  lastChangeUser: UserDocRef;
  category: CategoryDocRef;

  constructor(
    name: string,
    partNr: string,
    description: string,
    comment: string,
    status: string,
    parameters: Array<PartParameterEntry>,
    footprint: FootprintDocRef,
    lastChange: Timestamp,
    lastChangeUser: UserDocRef,
    category: CategoryDocRef
  ) {
    this.name = name;
    this.partNr = partNr;

    this.description = description;
    this.comment = comment;
    this.status = status;
    this.parameters = parameters;
    this.footprint = footprint;
    this.lastChange = lastChange;
    this.lastChangeUser = lastChangeUser;
    this.category = category;
  }
}

export const PartColRef = collection(db, "Part") as CollectionReference<Part>;
export type PartDocRef = DocumentReference<Part>;

export class StoredPart {
  part: PartDocRef;
  owner: UserDocRef;
  sharedGroups: Set<GroupDocRef>;
  storageLocation: StorageLocationDocRef;
  stock: number;
  minStock: number;
  stockHistory: [StockHistoryEntry];
  avgPrice: number;
  lastPrice: number;
  lastChange: Timestamp;
  lastChangeUser: UserDocRef;

  constructor(
    part: PartDocRef,
    owner: UserDocRef,
    sharedGroups: Set<GroupDocRef>,
    storageLocation: StorageLocationDocRef,
    stock: number,
    minStock: number,
    price: number
  ) {
    this.part = part;
    this.owner = owner;

    this.sharedGroups = sharedGroups;
    this.storageLocation = storageLocation;
    this.stock = stock;
    this.minStock = minStock;
    this.stockHistory = [
      {
        timestamp: Timestamp.now(),
        amount: stock,
        price: price,
        user: owner,
      },
    ];

    this.avgPrice = price;
    this.lastPrice = price;
    this.lastChange = Timestamp.now();
    this.lastChangeUser = owner;
  }
}
export const StoredPartColRef = collection(db, "StoredPart") as CollectionReference<StoredPart>;
export type StoredPartDocRef = DocumentReference<StoredPart>;
