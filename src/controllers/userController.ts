import { ServerResponse } from "node:http";
import { getAllUsers, getUserById, postUser } from "../db/users";
import { Uuid } from "../types/types/general.type";
import { validate as validateUuid } from "uuid";
import { errors, sendError } from "../utils/errors";
import { CreateUserDto } from "../types/user.interface";
import parseRequest from "../utils/parseRequest";
import { IncomingMessage } from "http";

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

const handlePostUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseRequest<CreateUserDto>(req);
    if (!body.username || !body.age || !body.hobbies) {
      sendError(res, errors.badRequest("Missing required fields"));
      return;
    }
    const newUser = postUser(body);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  } catch {
    sendError(res, errors.internalServerError());
  }
};

export { handleGetUsers, handleGetUserById, handlePostUser };
