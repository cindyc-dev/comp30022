export interface ConnectionI {
    name: string;
    phone?: string;
    email: string;
    tags: TagI[];
    notes?: string;
}