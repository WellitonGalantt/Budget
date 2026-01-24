import { Response } from "express";

export const successResponse = (
  res: Response,
  statusCode: number = 200,
  data?: any,
  message: string = "Success",
) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
