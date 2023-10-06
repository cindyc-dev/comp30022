export interface TaskI {
    id: string
    title: string;
    description: string;
    dueDate: string;
    status: string;
    // relatedConnections?: ConnectionI[];
}