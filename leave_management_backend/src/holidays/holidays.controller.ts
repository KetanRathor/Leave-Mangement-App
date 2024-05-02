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
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UploadedFiles,
  Put,
  Request,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HolidaysService } from './holidays.service';
// import { MulterFile } from 'multer';
import { Multer, diskStorage } from 'multer';
import { CreateHolidaysDto } from './dto/create-holidays.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiConsumes,
  ApiTags,
  ApiConsumes
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Holidays } from './entities/holidays.entity';
import { extname } from 'path';

@ApiBearerAuth('JWT-auth')
@ApiTags('holidays')
@Controller('holidays')
export class HolidaysController {
  imageService: any;
  constructor(private readonly holidaysService: HolidaysService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @ApiCreatedResponse({
    description: 'create holiday object ',
    type: Holidays,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file, @Body() body: any, @Request() req) {
    const inputData = body.data1;
    const createHolidayDto: CreateHolidaysDto = JSON.parse(inputData);

    const req_mail = req.user.email;
    const newHoliday = await this.holidaysService.uploadImage(
      createHolidayDto.date,
      createHolidayDto.day,
      createHolidayDto.occasion,
      file.buffer,
      req_mail,
    );

    return {
      message: 'Image uploaded for holiday successfully',
      holiday: newHoliday,
      req_mail,
    };
  }

  // @Get('count')
  // async getHolidaysCount() {
  //   const count = await this.holidaysService.getHolidaysCount();
  //   return {
  //     message: 'Total count of holidays retrieved successfully',
  //     count: count,
  //   };
  // }

  // @UseGuards(AuthGuard)
  // @Put('update/upload/:id')
  // @ApiBody({ type: Holidays })
  // @ApiOkResponse({ description: 'Holiday updated successfully' })
  // @ApiConflictResponse({ description: 'Conflict during update' })
  // @UseInterceptors(FileInterceptor('file'))
  // async updateHoliday(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
  //   // const inputData = body.data1;
  //   // const { date, day, occasion } = body
  //   // const createHolidayDto: CreateHolidaysDto = JSON.parse({ date, day, occasion });

  //   // const newHoliday = await this.holidaysService.uploadImage(
  //   //   createHolidayDto.date,
  //   //   createHolidayDto.day,
  //   //   createHolidayDto.occasion,
  //   //   file.buffer,
  //   // );
  //   console.log("body......", file)
  //   // const updatedHoliday = await this.holidaysService.updateHoliday({ id: id, date: date, day: day, occasion: occasion, image: file.buffer });
  //   // // console.log("___________________________", updatedHoliday)
  //   // if (!updatedHoliday) {
  //   return { message: 'Holiday update failed' };
  //   // }
  //   // return { message: 'Holiday updated successfully', holiday: updatedHoliday };
  // }

  @UseGuards(AuthGuard)
  @Get('upcoming')
  @ApiOkResponse({
    description: 'Get upcoming Holidays',
    type: [Holidays],
  })
  async getUpcomingHolidays() {
    const currentDate = new Date();
    const upcomingHolidays =
      await this.holidaysService.getUpcomingHolidays(currentDate);
    return {
      message: 'Upcoming holidays retrieved successfully',
      holidays: upcomingHolidays,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Employee with given ID will be deleted as response',
  })
  async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.holidaysService.deleteHolidays(id);
      return 'Holiday Deleted Successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Get('remaining-holidays')
  @ApiOkResponse({
    description: 'Get remaining holidays',
  })
  async getRemainingHolidays(): Promise<{ remainingHolidays: number }> {
    try {
      const remainingHolidays =
        await this.holidaysService.getRemainingHolidays();
      return { remainingHolidays };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'All Holidays List',
    type: [Holidays],
  })
  showHolidaysList() {
    return this.holidaysService.findAll();
  }
}
