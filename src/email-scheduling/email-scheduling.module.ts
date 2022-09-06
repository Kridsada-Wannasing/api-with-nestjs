import { Module } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';
import { EmailSchedulingController } from './email-scheduling.controller';

@Module({
  providers: [EmailSchedulingService],
  controllers: [EmailSchedulingController]
})
export class EmailSchedulingModule {}
