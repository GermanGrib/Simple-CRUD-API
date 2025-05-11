import { ServerResponse } from "node:http";
import { getAllUsers, getUserById } from "../db/users";
import { Uuid } from "../types/types/general.type";
import { validate as validateUuid } from "uuid";
import { errors, sendError } from "../utils/errors";

const handleGetUsers = (res: ServerResponse) => {
  const users = getAllUsers();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};

const handleGetUserById = (res: ServerResponse, id: Uuid) => {
  if (!validateUuid(id)) {
    sendError(res, errors.badRequest("Id type is not valid"));
  }

  const user = getUserById(id);
  if (!user) {
    sendError(res, errors.notFound(`User with id ${id} doesn't exist,`));
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};

export { handleGetUsers, handleGetUserById };
