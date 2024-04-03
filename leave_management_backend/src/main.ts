import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  await app.listen(process.env.SERVER_PORT);
=======
  await app.listen(3002);
>>>>>>> dd2948662f028272129db33bba63a72733cad706
}
bootstrap();
