import { EnvConfService } from '@/shared/infrastructure/env-conf/env-conf.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: EnvConfService
    ) { }

    async generateJwt(userId: string): Promise<string> {
        const token = await this.jwtService.signAsync(userId, {
            secret: this.configService.getJwtSecret()
        });
        return token;
    }

    async verifyJwt(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.getJwtSecret()
        });
    }

}
