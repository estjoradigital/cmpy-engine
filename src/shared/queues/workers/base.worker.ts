import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SqsQueueClient } from '../sqs';

export abstract class BaseQueueWorker implements OnModuleInit, OnModuleDestroy {
  protected abstract readonly queueUrl: string;
  protected abstract handle(payload: any): Promise<void>;

  private running = false;

  constructor(protected readonly sqs: SqsQueueClient) {}

  onModuleInit() {
    this.running = true;
    this.start();
  }

  onModuleDestroy() {
    this.running = false;
  }

  private async start() {
    while (this.running) {
      const messages = await this.sqs.receive(this.queueUrl);
      if (!messages.length) continue;

      for (const msg of messages) {
        await this.process(msg);
      }
    }
  }

  private async process(msg: any) {
    const payload = JSON.parse(msg.Body);
    const receiptHandle = msg.ReceiptHandle;

    try {
      await this.handle(payload);
      await this.sqs.delete(this.queueUrl, receiptHandle);
    } catch (e) {
      // no delete → SQS retry → DLQ
      console.error('SQS Queue job failed', e);
    }
  }
}
