import { Uuid } from "./types/general.type";

interface CreateUserDto {
  username: string;
  age: number;
  hobbies: string[] | [];
}

interface UserInterface extends CreateUserDto {
  id: Uuid;
}

export { UserInterface, CreateUserDto };
