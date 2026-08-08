import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

// Service for hashing and comparing passwords
@Injectable()
export class HashService {


    // COMPARA LA CONTRASEÑA CON SU HASH
    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }



    // HASHEA UNA CONTRASEÑA
    async hashPassword(password: string) {
        return await bcrypt.hash(password, 12);
    }
}