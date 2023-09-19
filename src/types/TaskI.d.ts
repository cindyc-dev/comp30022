export interface TaskI {
    title: string;
    description?: string;
    dueDate?: Date;
    status: string;
    // relatedConnections?: ConnectionI[];
}