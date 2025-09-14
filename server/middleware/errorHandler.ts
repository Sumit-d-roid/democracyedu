import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
  errors?: any[];
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const error: ErrorResponse = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.errors = Object.values(err.errors).map((err: any) => err.message);
    res.status(400);
  } else if (err.name === 'UnauthorizedError') {
    error.message = 'Unauthorized Access';
    res.status(401);
  } else {
    res.status(err.status || 500);
  }

  res.json(error);
};