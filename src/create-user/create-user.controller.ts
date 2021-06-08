import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { SendMailProducerService } from '../jobs/sendMail-producer-service';

@Controller('create-user')
export class CreateUserController {
  constructor(private sendMailService: SendMailProducerService) {}

  @Post('/')
  async createUser(@Body() createUser: CreateUserDTO) {
    await this.sendMailService.sendMail(createUser);
    return createUser;
  }
}
