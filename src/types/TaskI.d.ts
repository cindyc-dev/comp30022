export interface TaskI {
    id: string
    title: string;
    description?: string;
    dueDate: Date;
    status: string;
    // relatedConnections?: ConnectionI[];
}