export interface UserEntity {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserData {
    name: string;
    phone: string;
}
