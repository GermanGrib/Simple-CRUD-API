import cluster from "node:cluster";
import os from "node:os";
import http from "node:http";
import { spawn } from "node:child_process";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const numCPUs = os.availableParallelism();
const PORT = Number(process.env.PORT) || 4000;
const WORKERS_COUNT = numCPUs - 1;
let current = 0;
const workerPorts: number[] = [];

const DB_FILE = path.join(__dirname, "../users.db.json");

function getNextPort() {
  const port = workerPorts[current];
  current = (current + 1) % WORKERS_COUNT;
  return port;
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]), "utf-8");
      console.log("Created new database file");
    } else {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      JSON.parse(data);
    }
  } catch (error) {
    console.error("Database file initialization error:", error);
    process.exit(1);
  }

  for (let i = 0; i < WORKERS_COUNT; i++) {
    const workerPort = PORT + i + 1;
    spawn("node", ["dist/server.bundle.js"], {
      env: {
        ...process.env,
        PORT: workerPort.toString(),
      },
      stdio: "inherit",
    });
    workerPorts.push(workerPort);
  }

  const loadBalancer = http.createServer((req, res) => {
    const targetPort = getNextPort();

    const proxyReq = http.request(
      {
        hostname: "127.0.0.1",
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on("error", (err) => {
      console.error("Proxy error:", err.message);
      res.writeHead(500);
      res.end("Internal load balancer error");
    });
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer listening at http://localhost:${PORT}/api`);
  });

  process.on("SIGINT", () => {
    console.log("\nShutting down cluster...");
    loadBalancer.close();
    process.exit();
  });
}
