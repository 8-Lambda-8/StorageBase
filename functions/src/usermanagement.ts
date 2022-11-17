import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

admin.initializeApp();
export const db = new admin.firestore.Firestore();
export const userCol = db.collection("User");

export async function onDeleteUserFunction(user: UserRecord) {
  const userRef = userCol.doc(user.uid);
  userRef.delete().catch();
}

export async function onCreateUserFunction(user: UserRecord) {
  logger.log("Create DB for " + user.uid + " " + user.email + " n:" + user.displayName);

  userCol
    .doc(user.uid)
    .create({
      name: user.displayName ?? "Anon",
      permissionLevel: 0,
      picUrl: user.photoURL ?? "",
      lastOnline: Timestamp.now(),
      storedParts: [],
      userSettings: {},
    })
    .catch();
}
