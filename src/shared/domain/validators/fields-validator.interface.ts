export type FieldsErrors = {
    [field: string]: string[]
}

export interface FieldsValidatorInterface<PropsToBeValidated> {
    errors: FieldsErrors
    dataToBeValidated: PropsToBeValidated
    validate(data: any): boolean
}