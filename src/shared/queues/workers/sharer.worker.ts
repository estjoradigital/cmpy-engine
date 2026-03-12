import { Injectable, Logger } from '@nestjs/common';
import { BaseQueueWorker } from './base.worker';
import { PrismaConfig } from '@/configs';
import { SqsQueueClient } from '../sqs';

@Injectable()
export class CommissionShareWorker extends BaseQueueWorker {
  private logger = new Logger(CommissionShareWorker.name);
  protected readonly queueUrl = process.env.COMMUNITY_EARNINGS_QUEUE_URL!;

  constructor(
    protected readonly sqs: SqsQueueClient,
    private readonly prisma: PrismaConfig,
  ) {
    super(sqs);
  }

  protected async handle(payload) {
    this.logger.log('Received payload', payload);

    // Idempotency - Check if it's already handle and return

    // Handle income share between company members, transaction & ledger postings, notifications e.t.c
  }
}
