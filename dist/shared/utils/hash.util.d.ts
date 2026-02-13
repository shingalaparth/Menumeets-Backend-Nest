export declare function hashPassword(password: string, saltRounds?: number): Promise<string>;
export declare function comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean>;
