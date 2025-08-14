import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("server.json");
const middlewares = jsonServer.defaults();

server.use(
  cors({
    origin: ["https://sound-cln-frontend.vercel.app"], // atau "*"
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

server.use(middlewares);
server.use(router);
server.listen(40001, () => {
  console.log("JSON Server running");
});
