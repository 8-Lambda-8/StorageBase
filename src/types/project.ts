import { GroupDocRef } from "./types";
import { UserDocRef } from "./user";
import { StoredPartDocRef } from "./part";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Project {
  name: string;
  description: string;
  owner: UserDocRef;
  sharedGroups: Set<GroupDocRef>;
  private _bom: bomEntry[];
  private _price: number;

  constructor(name: string, owner: UserDocRef, description: string) {
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.sharedGroups = new Set<GroupDocRef>();
    this._price = 0;

    this._bom = <bomEntry[]>[];
  }

  public set bom(bom: bomEntry[]) {
    this._bom = bom;

    this.updatePrice();
  }

  private updatePrice() {
    this._price = 0;
    for (const bE of this._bom) {
      this._price += bE.count * bE.price;
    }
  }
  public get price() {
    return this._price;
  }
}

interface bomEntry {
  pos: number;
  count: number;
  part: StoredPartDocRef;
  price: number;
}
