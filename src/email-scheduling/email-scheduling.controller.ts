import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import EmailScheduleDto from './dto/email-schedule.dto';
import { EmailSchedulingService } from './email-scheduling.service';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
