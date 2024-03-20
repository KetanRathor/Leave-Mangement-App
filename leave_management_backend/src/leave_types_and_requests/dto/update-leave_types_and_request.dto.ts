import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveTypesAndRequestDto } from './create-leave_types_and_request.dto';

export class UpdateLeaveTypesAndRequestDto extends PartialType(CreateLeaveTypesAndRequestDto) {}
