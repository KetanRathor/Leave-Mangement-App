import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      rawBody:true,
      cors:true,
      bodyParser:true,
    }
  );
  const config = new DocumentBuilder()
  .setTitle('Leave Management API')
  .setDescription('leave management api description')
  .setVersion('1.0')
  .addBearerAuth({
    type:"http",
    scheme:"bearer",
    bearerFormat:"JWT",
    name:"JWT",
    description:"Enter JWT Token",
    in:"header"
  },"JWT-auth")
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
