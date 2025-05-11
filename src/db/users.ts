import { CreateUserDto, UserInterface } from "../types/user.interface";
import { Uuid } from "../types/types/general.type";
import { v4 as uuidv4 } from "uuid";

let users: UserInterface[] = [];

const getAllUsers = (): UserInterface[] => users;

const getUserById = (id: Uuid): UserInterface | undefined =>
  users.find((user) => user.id === id);

const postUser = (data: CreateUserDto): UserInterface => {
  const newUser: UserInterface = { id: uuidv4(), ...data };
  users.push(newUser);
  return newUser;
};

export { getAllUsers, getUserById, postUser };
