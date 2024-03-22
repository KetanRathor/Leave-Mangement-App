export class CreateEmployeeDto {
    name: string;
    email: string;
    mobile_number: string;
    department_id: number;
    role: string;
    manager_id?: number;
}