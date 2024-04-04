export class CreateLeaveTypesAndRequestDto {
  emp_id:number;
  start_date: Date;
  end_date: Date;
  reason: string;
  status: string;
  leave_type_id: any;
}