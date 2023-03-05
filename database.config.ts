import Dexie from "dexie";

const database = new Dexie("database");
database.version(1).stores({
  variants: "++id, name, entries",
});

export const variantTable = database.table("variants");

export default database;
