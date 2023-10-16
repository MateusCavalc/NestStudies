import { AuthenticationError } from '@/shared/domain/errors/Authentication-error';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(AuthenticationError)
export class AuthenticationErrorFilter implements ExceptionFilter {
  catch(exception: AuthenticationError, host: ArgumentsHost) {
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