import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from '../create-user/create-user-dto';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}
  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;
    const dateTime = Date();

    await this.mailService.sendMail({
      to: data.email,
      from: `${process.env.MAIL_FROM_NAME}<${process.env.MAIL_FROM}>`,
      subject: `Seja bem vindo! ${dateTime.toString()}`,
      text: `Olá ${data.email}, seu cadastro foi realizado com sucesso`,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }

  @OnQueueProgress()
  onQueueProgress(job: Job) {
    console.log(`On Progress ${job.name}`);
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log(`On Active ${job.name}`);
  }
}

export { SendMailConsumer };
