import { ServerResponse } from "node:http";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
} from "../db/users";
import { Uuid } from "../types/types/general.type";
import { validate as validateUuid } from "uuid";
import { errors, sendError } from "../utils/errors";
import { CreateUserDto } from "../types/user.interface";
import { parseRequest } from "../utils/parseRequest";
import { IncomingMessage } from "http";
import isCreateUserDto from "../validators/user.validator";

const handleGetUsers = async (res: ServerResponse) => {
  try {
    const users = await getAllUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error("Error getting users:", error);
    sendError(res, errors.internalServerError());
  }
};

const handleGetUserById = async (res: ServerResponse, id: Uuid) => {
  if (!validateUuid(id)) {
    sendError(res, errors.badRequest("Id type is not valid"));
    return;
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      sendError(res, errors.notFound(`User with id ${id} doesn't exist,`));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    console.error("Error getting user by ID:", error);
    sendError(res, errors.internalServerError());
  }
};

const handlePostUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseRequest<CreateUserDto>(req, isCreateUserDto);
    if (!body.username || !body.age || !body.hobbies) {
      sendError(res, errors.badRequest("Missing required fields"));
      return;
    }

    const newUser = await postUser(body);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      if (error.message.includes("Invalid request data")) {
        sendError(res, errors.badRequest("Invalid user data structure"));
        return;
      }
      if (error.message.includes("JSON")) {
        sendError(res, errors.badRequest("Invalid JSON format"));
        return;
      }
    }

    sendError(res, errors.internalServerError());
  }
};

const handleUpdateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: Uuid,
) => {
  if (!validateUuid(userId)) {
    sendError(res, errors.badRequest("Id type is not valid"));
    return;
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      sendError(res, errors.notFound(`User with id ${userId} doesn't exist,`));
      return;
    }

    const body = await parseRequest<CreateUserDto>(req);
    const updatedUserInfo = await updateUser(user, body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUserInfo));
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      if (error.message.includes("Invalid request data")) {
        sendError(res, errors.badRequest("Invalid user data structure"));
        return;
      }
      if (error.message.includes("JSON")) {
        sendError(res, errors.badRequest("Invalid JSON format"));
        return;
      }
    }

    sendError(res, errors.internalServerError());
  }
};

const handleDeleteUser = async (res: ServerResponse, userId: Uuid) => {
  if (!validateUuid(userId)) {
    sendError(res, errors.badRequest("Id type is not valid"));
    return;
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      sendError(res, errors.notFound(`User with id ${userId} doesn't exist,`));
      return;
    }

    await deleteUser(userId);
    res.writeHead(204, { "Content-Type": "application/json" });
    res.end();
  } catch (error) {
    console.error("Error deleting user:", error);
    sendError(res, errors.internalServerError());
  }
};

export {
  handleGetUsers,
  handleGetUserById,
  handlePostUser,
  handleUpdateUser,
  handleDeleteUser,
};
