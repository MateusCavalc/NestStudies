export type FieldsErrors = {
    [field: string]: string[]
}

export interface ValidatorInterface<Props> {
    errors: FieldsErrors;
    toBeValidated: Props;

    validate();
}