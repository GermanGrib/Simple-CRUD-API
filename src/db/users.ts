import { CreateUserDto, UserInterface } from "../types/user.interface";
import { Uuid } from "../types/types/general.type";
import { v4 as uuidv4 } from "uuid";
import { readUsers, writeUsers } from "./fileStorage";

const getAllUsers = async (): Promise<UserInterface[]> => {
  return await readUsers();
};

const getUserById = async (id: Uuid): Promise<UserInterface | undefined> => {
  const users = await readUsers();
  return users.find((user) => user.id === id);
};

const postUser = async (data: CreateUserDto): Promise<UserInterface> => {
  const users = await readUsers();
  const newUser: UserInterface = { id: uuidv4(), ...data };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
};

const updateUser = async (
  user: UserInterface,
  data: CreateUserDto,
): Promise<UserInterface> => {
  const users = await readUsers();
  const userIndex = users.findIndex((userInDb) => userInDb.id === user.id);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const updatedUser = { ...user, ...data };
  users[userIndex] = updatedUser;
  await writeUsers(users);
  return updatedUser;
};

const deleteUser = async (userId: Uuid): Promise<boolean> => {
  const users = await readUsers();
  const initialLength = users.length;
  const newUsers = users.filter((user) => user.id !== userId);

  if (newUsers.length === initialLength) {
    return false;
  }

  await writeUsers(newUsers);
  return true;
};

export { getAllUsers, getUserById, postUser, updateUser, deleteUser };
