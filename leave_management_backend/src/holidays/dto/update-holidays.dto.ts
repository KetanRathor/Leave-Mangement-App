import { PartialType } from '@nestjs/mapped-types';
import { CreateHolidaysDto } from './create-holidays.dto';

export class UpdateHolidaysDto extends PartialType(CreateHolidaysDto) {}
