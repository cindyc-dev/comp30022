export interface ConnectionI {
    id: string;
    name: string;
    phone?: string;
    photoUrl?: string;
    email: string;
    tags: string[];
    notes?: string;
    isExisting?: boolean;
}