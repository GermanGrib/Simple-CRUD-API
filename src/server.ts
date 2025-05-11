import http from "node:http";
import {
  handleGetUserById,
  handleGetUsers,
  handlePostUser,
} from "./controllers/userController";

const hostname = "127.0.0.1";
const port = 3000;
const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (method === "GET" && url) {
    const isRequestByUserId = /^\/api\/users\/[^/]+$/.test(url);

    if (url === "/api/users") {
      handleGetUsers(res);
    }

    if (isRequestByUserId) {
      const userId = url.split("/")[3];
      handleGetUserById(res, userId);
    }
  }

  if (method === "POST" && url) {
    if (url === "/api/users") {
      handlePostUser(req, res);
    }
  }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
