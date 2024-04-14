import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HolidaysService } from './holidays.service';
// import { MulterFile } from 'multer';
import { Multer } from 'multer';
import { CreateHolidaysDto } from './dto/create-holidays.dto';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Holidays } from './entities/holidays.entity';

@ApiBearerAuth()
@ApiTags('Holidays')
@Controller('holidays')
export class HolidaysController {
  imageService: any;
  constructor(private readonly holidaysService: HolidaysService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @ApiBody({
    type:Holidays
  })
  @ApiCreatedResponse({
    description:'create holiday object ',
    type:Holidays
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Body() body: any) {
  
    const inputData = body.data1;
    const createHolidayDto: CreateHolidaysDto = JSON.parse(inputData);

    const newHoliday = await this.holidaysService.uploadImage(
      createHolidayDto.date,
      createHolidayDto.day,
      createHolidayDto.occasion,
      file.buffer,
    );

    return {
      message: 'Image uploaded for holiday successfully',
      holiday: newHoliday,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description:'Get all Holidays',
    type:[Holidays]
  })
  async getAllHolidays() {
    const holidays = await this.holidaysService.getAllHolidays();
    return {
      message: 'All holidays retrieved successfully',
      holidays: holidays,
    };
  }

  @Get('count')
  async getHolidaysCount() {
    const count = await this.holidaysService.getHolidaysCount();
    return {
      message: 'Total count of holidays retrieved successfully',
      count: count,
    };
  }


  @UseGuards(AuthGuard)
  @Put('upload/:id')
  @ApiBody({ type: Holidays })
  @ApiOkResponse({ description: 'Holiday updated successfully' })
  @ApiConflictResponse({ description: 'Conflict during update' })
  async updateHoliday(@Param('id') id: number, @Body() body: Holidays) {
    const updatedHoliday = await this.holidaysService.updateHoliday(id, body);
    // console.log("___________________________", updatedHoliday)
    if (!updatedHoliday) {
      return { message: 'Holiday update failed' };
    }
    return { message: 'Holiday updated successfully', holiday: updatedHoliday };
  }


  //   @Get('images/:id')
  //   async getHolidayImage(@Param('id') id: number, @Res() res: Response) {
  //     try {
  //       const imagePath = await this.imageService.getImagePathById(id);

  //       if (!imagePath) {
  //         return res.status(404).send({ message: 'Image not found' });
  //       }

  //       const imageFullPath = join('uploads', imagePath); // Assuming images are stored in 'uploads' folder
  //       const imageBuffer = await asyncReadFile(imageFullPath);

  //       res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your image type
  //       res.end(imageBuffer);
  //     } catch (error) {
  //       res.status(500).send({ message: 'Internal server error' });
  //     }
  //   }




}
