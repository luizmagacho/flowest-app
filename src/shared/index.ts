export interface FormState<T> {
    data: T;
    errors: string[];
    loading: boolean;
}

export interface DialogData<T> {
    visible: boolean;
    onHide: () => void;
    mode?: DialogMode;
    data: T;
}

export interface DialogState {
    view: boolean;
    edit: boolean;
    delete: boolean;
    add: boolean;
    send?: boolean;
    json: boolean;
}

export type DialogMode = "edit" | "create" | null;

export interface Page<T> {
    empty: boolean;
    first: boolean;
    last: boolean;
    content: T[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    page: number;
    size: number;
}
