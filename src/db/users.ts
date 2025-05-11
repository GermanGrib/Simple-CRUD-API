import { UserInterface } from "../types/user.interface";
import { Uuid } from "../types/types/general.type";

let users: UserInterface[] = [];

const getAllUsers = (): UserInterface[] => users;

const getUserById = (id: Uuid): UserInterface | undefined =>
  users.find((user) => user.id === id);

export { getAllUsers, getUserById };
