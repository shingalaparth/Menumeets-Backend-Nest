/**
 * Hash Utility
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
