import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConflictErrorFilter } from "./shared/infrastructure/exception-filters/conflict-error/conflict-error.filter";

export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe(
        {
            errorHttpStatusCode: 422,
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }
    ));

    app.useGlobalFilters(new ConflictErrorFilter());
}