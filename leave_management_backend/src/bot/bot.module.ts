// import { Module } from '@nestjs/common';

// @Module({})
// export class BotModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import { BotFrameworkAdapter, ActivityHandler } from 'botbuilder';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }), // Load configuration from .env file (optional)
  ],
  providers: [
    BotService,
    {
      provide: 'BOT_CONFIGURATION',
      useFactory: (configService: ConfigService) => ({
        appId: configService.get('BOT_APP_ID'),
        appPassword: configService.get('BOT_APP_SECRET'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [BotService],
})
export class BotModule {}
