export class CreateLeaveTypesAndRequestDto {
  leave_request_id: number;
  emp_id: number;
  leave_type_id: number;
  start_date: Date;
  end_date: Date;
  reason: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  updated_status: string;
}