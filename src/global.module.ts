import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaConfig } from '@/configs';
import { QueueModule } from '@/shared/queues';

@Global()
@Module({
  imports: [QueueModule],
  providers: [PrismaConfig, JwtService],
})
export class GlobalModule {}
