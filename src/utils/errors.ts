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
  methodNotAllowed: (): AppError => ({
    statusCode: 405,
    message: "Method Not Allowed",
  }),
  internalServerError: (customMessage?: string): AppError => ({
    statusCode: 500,
    message:
      customMessage ||
      "Errors on the server side: something went wrong. Please try again later or contact support.",
  }),
};

function sendError(res: ServerResponse, error: AppError) {
  res.writeHead(error.statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: error.message }));
}

export { errors, sendError, AppError };
