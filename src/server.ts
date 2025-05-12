import http from "node:http";
import {
  handleDeleteUser,
  handleGetUserById,
  handleGetUsers,
  handlePostUser,
  handleUpdateUser,
} from "./controllers/userController";
import { errors, sendError } from "./utils/errors";
import dotenv from "dotenv";

dotenv.config();

const hostname = "127.0.0.1";
const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  try {
    if (!url?.startsWith("/api/users")) {
      sendError(res, errors.notFound("Endpoint"));
      return;
    }
    const isRequestByUserId = /^\/api\/users\/[^/]+$/.test(url);
    const userId = url.split("/")[3];

    switch (true) {
      case method === "GET" && url === "/api/users":
        await handleGetUsers(res);
        break;

      case method === "GET" && isRequestByUserId:
        await handleGetUserById(res, userId);
        break;

      case method === "POST" && url === "/api/users":
        await handlePostUser(req, res);
        break;

      case method === "PUT" && isRequestByUserId:
        await handleUpdateUser(req, res, userId);
        break;

      case method === "DELETE" && isRequestByUserId:
        await handleDeleteUser(res, userId);
        break;

      default:
        sendError(res, errors.methodNotAllowed());
    }
  } catch (error) {
    console.error("Server error:", error);
    sendError(res, errors.internalServerError());
  }
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 4000;
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

export default server;
