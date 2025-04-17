import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application, type Response } from "express";
import { StatusCodes } from "http-status-codes";

import morganMiddleware from "@/middlewares/morgan.middleware";

const app: Application = express();

app
  .use(cors({ origin: "http://localhost:3001", credentials: true }))
  .use(morganMiddleware)
  .use(cookieParser())
  .use(express.json())
  .get("/api/health", (_, res: Response) => {
    res.status(StatusCodes.OK).json({
      ok: true,
    });
  });

export default app;
