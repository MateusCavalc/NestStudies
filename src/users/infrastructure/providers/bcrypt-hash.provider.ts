import { HashProvider } from "@/shared/application/providers/hash-provider";
import { hash, compare } from "bcryptjs"

export class BcryptHashProvider implements HashProvider {
    async generateHash(payload: string): Promise<string> {
        return hash(payload, 10);
    }
    async compareHash(payload: string, hashed: string): Promise<boolean> {
        return compare(payload, hashed);
    }

}