import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Logger } from '../logging/Logger';
import { Request, Response } from 'express';
import { ErrorMessage } from '../constants/error.message';
import * as dayjs from 'dayjs';

interface customException {
  timestamp: string;
  message: string;
  status: number;
  customErrorNumber: number;
  query?: string;
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger: Logger;

  constructor() {
    this.logger = new Logger('HttpExceptionFilter');
  }

  catch(err: customException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const tag = request.url;
    console.log({ err });
    if (!err) err = ErrorMessage.systemError.oopsSomethingWentWrong;
    if (err.query) err = ErrorMessage.systemError.oopsSomethingWentWrong;
    err.timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.logger.error(err, { tag, data: err });
    this.logger.logRoute(request, response, { ...err });
    void response.status(err?.status || 400).send(err);
  }
}
