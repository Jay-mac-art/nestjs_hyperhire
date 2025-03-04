import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

export interface Response<T> {
  result: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const expressResponse = context
      .switchToHttp()
      .getResponse<ExpressResponse>();
    return next.handle().pipe(
      map((data) => {
        expressResponse.status(200);
        return { status: 200, message: 'success', result: data || {} };
      }),
    );
  }
}
