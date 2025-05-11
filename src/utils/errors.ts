import { ServerResponse } from "node:http";

type AppError = {
  statusCode: number;
  message: string;
};

const errors = {
  badRequest: (message: string): AppError => ({
    statusCode: 400,
    message: `Bad Request: ${message}`,
  }),
  notFound: (entity: string): AppError => ({
    statusCode: 404,
    message: `${entity} not found`,
  }),
  internalServerError: (): AppError => ({
    statusCode: 500,
    message: "Internal Server Error",
  }),
};

function sendError(res: ServerResponse, error: AppError) {
  res.writeHead(error.statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: error.message }));
}

export { errors, sendError, AppError };
