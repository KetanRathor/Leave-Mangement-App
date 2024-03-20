import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypesAndRequestsController } from './leave_types_and_requests.controller';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';

describe('LeaveTypesAndRequestsController', () => {
  let controller: LeaveTypesAndRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveTypesAndRequestsController],
      providers: [LeaveTypesAndRequestsService],
    }).compile();

    controller = module.get<LeaveTypesAndRequestsController>(LeaveTypesAndRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
