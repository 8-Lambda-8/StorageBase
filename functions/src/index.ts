import { region } from "firebase-functions";
import { onCreateUserFunction, onDeleteUserFunction } from "./usermanagement";

const ServerRegion = "europe-west3";

// User Management
export const onCreateUser = region(ServerRegion).auth.user().onCreate(onCreateUserFunction);

export const onDeleteUser = region(ServerRegion).auth.user().onDelete(onDeleteUserFunction);
