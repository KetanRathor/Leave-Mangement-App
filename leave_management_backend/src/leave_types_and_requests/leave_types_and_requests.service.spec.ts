import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypesAndRequestsService } from './leave_types_and_requests.service';

describe('LeaveTypesAndRequestsService', () => {
  let service: LeaveTypesAndRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveTypesAndRequestsService],
    }).compile();

    service = module.get<LeaveTypesAndRequestsService>(LeaveTypesAndRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
