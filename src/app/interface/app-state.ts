import { DataState } from "../enum/data-state.enum"

export interface AppState<T> {
    dateaState: DataState;
    appData?: T;
    error?: string;
}