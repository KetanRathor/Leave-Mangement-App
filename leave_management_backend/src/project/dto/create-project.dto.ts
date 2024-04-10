export class CreateProjectDto {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
    managerName?: string; 
  }