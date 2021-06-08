import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateUserDTO } from '../create-user/create-user-dto';

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) {}
  async sendMail(createUserDTO: CreateUserDTO) {
    await this.queue.add('sendMail-job', createUserDTO);
  }
}

export { SendMailProducerService };
