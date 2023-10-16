import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AuthenticationErrorFilter } from "./shared/infrastructure/exception-filters/bad-auth.filter";
import { ConflictErrorFilter } from "./shared/infrastructure/exception-filters/conflict-error.filter";
import { InvalidPasswordErrorFilter } from "./shared/infrastructure/exception-filters/invalid-password";
import { NotFoundErrorFilter } from "./shared/infrastructure/exception-filters/not-found.filter";

export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe(
        {
            errorHttpStatusCode: 422,
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }
    ));

    app.useGlobalFilters(
        new ConflictErrorFilter(),
        new NotFoundErrorFilter(),
        new AuthenticationErrorFilter(),
        new InvalidPasswordErrorFilter()
    );
}