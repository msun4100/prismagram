import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import "./passport";
import { authenticateJwt } from "./passport";
import { isAuthenticated } from "./middlewares";
import { uploadMiddleware, uploadController } from "./upload";
import cors from "cors";
// import express from "express";

const PORT = process.env.PORT || 4000;

// context에 request만 담긴 객체 리턴, console.dir로 확인
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated }),
});

// server.express.use("/uploads", express.static("uploads"));
server.express.use(logger("dev"));
server.express.use(authenticateJwt);
server.express.post("/api/upload", cors(), uploadMiddleware, uploadController);

server.start({ port: PORT }, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
