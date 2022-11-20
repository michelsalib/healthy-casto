import { Timestamp } from "@angular/fire/firestore";

export interface User {
    id: string;
    creationDate: Timestamp;
    displayName: string;
    email: string;
    photoURL: string;
    objectives: ObjectiveConfig[];
}

export interface ObjectiveConfig {
    id: string;
    target: number;
    averageValue: number;
}