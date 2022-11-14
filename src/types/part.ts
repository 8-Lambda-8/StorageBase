import { UserDocRef } from "./user";
import { CategoryDocRef } from "./category";
import { Timestamp, CollectionReference, DocumentReference, collection } from "firebase/firestore";
import {
  Footprint,
  GroupDocRef,
  Parameter,
  StockHistoryEntry,
  StorageLocationDocRef,
} from "./types";
import { db } from "../firebase";

class Part {
  name: string;
  partNr: string;
  description: string;
  comment: string;
  status: string;
  parameters: Set<Parameter>;
  footprint: Footprint;
  lastChange: Timestamp;
  lastChangeUser: UserDocRef;
  category: CategoryDocRef;

  constructor(
    name: string,
    partNr: string,
    description: string,
    comment: string,
    status: string,
    parameters: Set<Parameter>,
    footprint: Footprint,
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
