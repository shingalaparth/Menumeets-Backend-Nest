/**
 * Hash Utility — migrated from old utils/hash.js
 * Uses bcryptjs for password hashing and comparison.
 */
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string, saltRounds = 12): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
    candidatePassword: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
}
