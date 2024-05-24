import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session'
import * as passport from 'passport'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

dotenv.config();
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,
    {
      rawBody:true,
      // cors:true,
      bodyParser:true,
    }
  );

  var corsOptions = {
    origin: "http://localhost:3000"
  };
  
  app.use(cors(corsOptions));
  // app.enableCors({
  //   origin: 'http://localhost:3000', // React app URL
  //   credentials: true,
  // });
  
//   const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = ['http://localhost:3000'];
//     if (allowedOrigins.includes(origin)) {
//       callback(null, origin);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));

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
app.use(session({
  secret:'kjansckjnascnalscascnacasnlk',
  saveUninitialized:false,
  resave:false,
  cookie:{
    maxAge:60000
  },
}),
);
app.use(passport.initialize());
app.use(passport.session());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
