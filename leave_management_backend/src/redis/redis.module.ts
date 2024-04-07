// // import { Module } from '@nestjs/common';

// // @Module({})
// // export class RedisModule {}


// import { Module } from '@nestjs/common';
// import { RedisModule } from 'nestjs-redis';

// @Module({
//   imports: [
//     RedisModule.forRoot({
//       // Configuration options for Redis
//       config: {
//         host: process.env.REDIS_HOST || 'localhost', // Redis host
//         port: parseInt(process.env.REDIS_PORT, 10) || 6379, // Redis port
//         // Other configuration options if needed
//       },
//     }),
//   ],
// })
// export class MyRedisModule {}

