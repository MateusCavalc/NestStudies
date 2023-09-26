import { Injectable } from '@nestjs/common';
import { EnvConf } from './env-conf.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfService implements EnvConf {
    constructor(private configService: ConfigService) { }

    getAppPort(): number {
        return Number(this.configService.get<number>("PORT"));
    }
    getNodeEnv(): string {
        return this.configService.get<string>("NODE_ENV");
    }
}
