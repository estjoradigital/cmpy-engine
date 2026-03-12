import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import appConfigs from './configs/app.configs';
import redisConfig from './configs/redis.config';
import { RedisModule } from '@/shared';
import { FileModule } from './modules/file/file.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailsModule } from '@/shared/alerts/emails/emails.module';
import { NotificationsModule } from '@/shared/alerts/notifications/notifications.module';
import smtpConfig from '@/configs/smtp.config';
import * as path from 'path';
import { BullModule, BullRootModuleOptions } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfigs, redisConfig, smtpConfig],
      ignoreEnvFile: true,
    }),
    EventEmitterModule.forRoot(),
    GlobalModule,
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(redisConfig)],
      inject: [redisConfig.KEY],
      useFactory: (config: ConfigType<typeof redisConfig>): BullRootModuleOptions => {
        return {
          url: config.url,
        };
      },
    }),
    MailerModule.forRootAsync({
      inject: [smtpConfig.KEY],
      useFactory: (config: ConfigType<typeof smtpConfig>) => ({
        transport: config.url,
        defaults: {
          from: `"${config.label}" <${config.from}>`,
        },
        template: {
          dir: path.join(__dirname, 'shared', 'mail', 'templates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
            partials: {
              dir: path.join(__dirname, 'shared', 'mail', 'templates', 'partials'),
            },
          },
        },
        preview: false,
      }),
    }),
    RedisModule,
    FileModule,
    EmailsModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
