import * as winston from 'winston';
import { SampleTransport } from './Sample.transport';
import * as dayjs from 'dayjs';
import { Request, Response } from 'express';
export class ILogMeta {
  tag?: string;

  data?: any;
}

export class Logger {
  constructor(private readonly name: string) {}

  info(message: string, meta?: ILogMeta): void {
    const tag = meta?.tag ?? this.name;
    winston.info({
      message: `[${tag}] ${message}`,
      data: Logger.getData(tag, message, meta),
    });
  }

  error(error: any, meta?: ILogMeta): void {
    const tag = meta?.tag ?? this.name;
    const message = error.stack ?? error.message;
    winston.error({
      message: `[${tag}] ${message}`,
      data: Logger.getData(tag, message, meta),
    });
  }

  warn(message: string, meta?: ILogMeta): void {
    const tag = meta?.tag ?? this.name;
    winston.warn({
      message: `[${tag}] ${message}`,
      data: Logger.getData(tag, message, meta),
    });
  }

  debug(message: string, meta?: ILogMeta): void {
    const tag = meta?.tag ?? this.name;
    winston.debug({
      message: `[${tag}] ${message}`,
      data: Logger.getData(tag, message, meta),
    });
  }

  verbose(message: string, meta?: ILogMeta): void {
    const tag = meta?.tag ?? this.name;
    winston.verbose({
      message: `[${tag}] ${message}`,
      data: Logger.getData(tag, message, meta),
    });
  }

  logRoute(request: Request, response: Response, responseBody?: any): void {
    const statusCode = response.statusCode;
    const method = request.method;
    const url = request.url;
    const tag = 'ROUTE';
    const ip = request.headers['x-ip'] as string;

    const requestTime: any =
      parseInt(request.headers['x-request-time'] as string) || new Date();
    const requestTimeISO = dayjs(requestTime).toISOString();
    const duration = dayjs().valueOf() - requestTime;

    const data = {
      tag,
      request: {
        url,
        method,
        requestTime: requestTimeISO,
        ip,
        headers: request.headers,
        query: Object.assign({}, request.query),
        body: Object.assign({}, request.body),
      },
      response: {
        duration,
        statusCode,
        headers: response.getHeaders(),
        body: responseBody,
      },
    };

    const message = `${method} ${url} - ${statusCode} - ${duration}ms`;

    this.info(message, { tag, data });
  }

  private static getData(tag: string, message: string, meta?: ILogMeta): any {
    const data = meta?.data ?? {};
    data.tag = tag;
    data.message = message;
    return data;
  }
}

export function initializeWinston(): void {
  const { combine, timestamp, printf, colorize } = winston.format;

  const myFormat = printf(({ level, message, timestamp, data }) => {
    const formattedTimestamp = dayjs(timestamp.toString()).format().toString();

    let formatted = `${formattedTimestamp} | ${level}: ${message}`;
    if (data !== undefined) {
      formatted += `\n${JSON.stringify(data)}`;
    }

    return formatted;
  });

  winston.configure({
    level: 'debug',
    format: combine(timestamp(), myFormat),
    transports: [
      new SampleTransport(),
      new winston.transports.Console({
        format: combine(myFormat, colorize({ all: true })),
      }),
    ],
  });
}
