/**
 * Zod Validation Pipe — migrated from old validateResource.middleware.js
 *
 * Old: validateResource(schema) validates body, query, params against Zod schema
 * New: Pipe-based validation, usable per-route or per-param
 *
 * Usage:
 *   @UsePipes(new ZodValidationPipe(MyZodSchema))
 *   @Post()
 *   create(@Body() dto: MyDto) { ... }
 */
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));

                throw new BadRequestException({
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
