import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { AllowAny } from '../auth/decorators/allow-any.decorator';
import { ContactDto } from './dto/Contact.dto';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/contact')
  @ApiOperation({ summary: 'Send contact email' })
  @ApiResponse({
    status: 200,
  })
  @HttpCode(HttpStatus.OK)
  @AllowAny()
  async contactMail(@Body() contactDto: ContactDto) {
    return this.mailService.addContactEmailToQueue(contactDto);
  }
}
