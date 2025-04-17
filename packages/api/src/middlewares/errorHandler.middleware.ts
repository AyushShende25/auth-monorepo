import type { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { env } from "@/config/env";
import { BaseError } from "@/errors";
import Logger from "@/utils/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseError) {
    res.status(err.StatusCode).json({
      success: false,
      errors: err.serializeErrors(),
    });
    return;
  }
  env.NODE_ENV === "development" && Logger.error(err);

  // For unexpected errors a generic error message
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    errors: [{ message: "Something went wrong" }],
  });
};
