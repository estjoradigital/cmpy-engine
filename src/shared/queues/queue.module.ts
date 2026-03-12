import { Module } from '@nestjs/common';
import { CommissionShareWorker } from './workers';
import { PrismaConfig, SQSConfig } from '@/configs';
import { SqsQueueClient } from './sqs';

@Module({
  providers: [CommissionShareWorker, SQSConfig, SqsQueueClient, PrismaConfig],
  exports: [CommissionShareWorker, SqsQueueClient],
})
export class QueueModule {}
