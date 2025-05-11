import { IncomingMessage } from "http";

export async function parseRequest<T>(req: IncomingMessage): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk: string | Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedData: T = JSON.parse(body) as T;
        resolve(parsedData);
      } catch (err) {
        reject(
          new Error(
            `Invalid JSON format: ${err instanceof Error ? err.message : String(err)}`,
          ),
        );
      }
    });

    req.on("error", (error: Error) => {
      reject(error);
    });
  });
}

export default parseRequest;
