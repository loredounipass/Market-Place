import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

// Service for hashing and comparing passwords
@Injectable()
export class HashService {
    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }

    // Hashes a password with a salt round of 12
    async hashPassword(password: string) {
        return await bcrypt.hash(password, 12);
    }
}