import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Public } from 'src/common/decorators/Public.decorator';
import { createAccountTemplate } from 'src/common/templates/create-account';

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) { }
  async create(createEmailDto: CreateEmailDto) {
    try {
      const sendEmail =  await this.mailerService.sendMail({
        to: createEmailDto.to,
        subject: createEmailDto.subject,
        text: createEmailDto.text,
        html: createEmailDto.body,
        from: process.env.SMTP_FROM,
      })
      return sendEmail;
    } catch (error) {
      throw new Error("Error sending email: " + error.message);
    }
  }

  @Public()
  async findAll() {


    return `This action returns all emails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
