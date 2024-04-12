export class CreateProjectDto {
    name: string;
    manager_name:string;
    description: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
    managerName?: string; 
  }