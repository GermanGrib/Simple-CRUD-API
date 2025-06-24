import { CreateUserDto } from "../types/user.interface";

const isCreateUserDto = (data: unknown): data is CreateUserDto => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const { username, age, hobbies } = data as Record<string, unknown>;

  return (
    typeof username === "string" &&
    typeof age === "number" &&
    Array.isArray(hobbies) &&
    hobbies.every((hobby) => typeof hobby === "string")
  );
};
export default isCreateUserDto;
