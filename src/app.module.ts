import { Module } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { createBullBoard } from 'bull-board';
import { CreateUserController } from './create-user/create-user.controller';
import { SendMailProducerService } from './jobs/sendMail-producer-service';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { MiddlewareBuilder } from '@nestjs/core';
import { BullAdapter } from 'bull-board/bullAdapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
  ],
  controllers: [CreateUserController],
  providers: [SendMailProducerService, SendMailConsumer],
})
export class AppModule {
  constructor(@InjectQueue('sendMail-queue') private sendMailQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendMailQueue)]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
