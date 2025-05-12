import { IncomingMessage } from "http";

export async function parseRequest<T>(
  req: IncomingMessage,
  validator?: (data: unknown) => data is T,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk: string | Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedData = JSON.parse(body);

        if (validator && !validator(parsedData)) {
          throw new Error("Data validation failed");
        }

        resolve(parsedData as T);
      } catch (err) {
        reject(
          new Error(
            `Invalid request data: ${err instanceof Error ? err.message : String(err)}`,
          ),
        );
      }
    });

    req.on("error", (error: Error) => {
      reject(error);
    });
  });
}
