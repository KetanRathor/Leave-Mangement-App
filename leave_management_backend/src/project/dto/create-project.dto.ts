export class CreateProjectDto {
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
    managerName?: string; 
  }