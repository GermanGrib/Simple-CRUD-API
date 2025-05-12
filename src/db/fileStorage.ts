import fs from "node:fs/promises";
import path from "node:path";
import { UserInterface } from "../types/user.interface";

const DB_FILE = path.join(__dirname, "../../users.db.json");

async function readUsers(): Promise<UserInterface[]> {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("Error reading users:", error);
    throw error;
  }
}

async function writeUsers(users: UserInterface[]): Promise<void> {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing users:", error);
    throw error;
  }
}

export { readUsers, writeUsers };
