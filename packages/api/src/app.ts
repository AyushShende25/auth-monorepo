import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application, type Response } from "express";
import { StatusCodes } from "http-status-codes";

import { env } from "@/config/env";
import { NotFoundError } from "@/errors";
import { errorHandler } from "@/middlewares/errorHandler.middleware";
import morganMiddleware from "@/middlewares/morgan.middleware";

const app: Application = express();

app
  .use(cors({ origin: env.CLIENT_URL, credentials: true }))
  .use(morganMiddleware)
  .use(cookieParser())
  .use(express.json())
  .get("/api/health", (_, res: Response) => {
    res.status(StatusCodes.OK).json({
      ok: true,
    });
  });

app
  .all("*splat", () => {
    throw new NotFoundError();
  })
  .use(errorHandler);

export default app;
