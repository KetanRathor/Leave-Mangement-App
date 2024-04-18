import { ApiProperty } from "@nestjs/swagger";

export class UpdateLeaveStatus {
    @ApiProperty({
        description:'status of leave request',
        example:'pending'
      })
      status: string;
}
