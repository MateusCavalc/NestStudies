import { ConflictError } from '@/shared/domain/errors/Conflict-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(ConflictError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    // switch context to http -> Able to get req/res
    const ctx = host.switchToHttp();

    // get the response object
    const res = ctx.getResponse<FastifyReply>();

    res
      .status(409)
      .send({
        statusCode: 409,
        error: 'Conflict',
        message: exception.message
      });

  }
}