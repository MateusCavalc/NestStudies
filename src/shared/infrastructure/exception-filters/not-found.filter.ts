import { NotFoundError } from '@/shared/domain/errors/NotFound-error';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    // switch context to http -> Able to get req/res
    const ctx = host.switchToHttp();

    // get the response object
    const res = ctx.getResponse<FastifyReply>();

    res
      .status(HttpStatus.NOT_FOUND)
      .send({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'NotFound',
        message: exception.message
      });

  }
}