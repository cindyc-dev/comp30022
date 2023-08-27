export interface ConnectionI {
    name: string;
    phone?: string;
    photoUrl?: string;
    email: string;
    tags: TagI[];
    notes?: string;
}