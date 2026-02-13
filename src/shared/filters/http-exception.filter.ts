/**
 * Global Exception Filter — replaces old error-handling middleware
 *
 * Old: app.use((err, req, res, next) => res.status(500).json(...))
 * New: @Catch() filter with structured error response
 */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: unknown = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse as Record<string, unknown>;
                message = (resp.message as string) || message;
                errors = resp.errors;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Log in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('❌ Exception:', exception);
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            ...(errors ? { errors } : {}),
        });
    }
}
