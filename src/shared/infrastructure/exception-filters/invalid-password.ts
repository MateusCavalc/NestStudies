import { InvalidPasswordError } from '@/shared/domain/errors/InvalidPassword-error';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: InvalidPasswordError, host: ArgumentsHost) {
    // switch context to http -> Able to get req/res
    const ctx = host.switchToHttp();

    // get the response object
    const res = ctx.getResponse<FastifyReply>();

    res
      .status(HttpStatus.UNAUTHORIZED)
      .send({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: exception.message
      });

  }
}