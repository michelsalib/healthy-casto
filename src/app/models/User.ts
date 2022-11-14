export interface User {
    id: string;
    creationDate: string;
    displayName: string;
    email: string;
    photoURL: string;
    objectives: ObjectiveConfig[];
}

export interface ObjectiveConfig {
    id: string;
}