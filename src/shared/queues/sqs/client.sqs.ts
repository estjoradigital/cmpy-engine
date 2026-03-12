import { Injectable, Logger } from '@nestjs/common';
import { SQSConfig } from '@/configs';
import { ExceptionHandler } from '@/utils';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import { OnEvent } from '@nestjs/event-emitter';
import { PlatformEvents } from '@/common/constants';
import { PublishSQSMessage } from '@/common/typings';

@Injectable()
export class SqsQueueClient {
  private logger = new Logger(SqsQueueClient.name);
  constructor(private readonly sqsConfig: SQSConfig) {
    this.logger.log('SQS client (Transport layer) initialized');
  }

  async publish<T>(
    queueUrl: string,
    payload: T,
    options?: {
      messageGroupId?: string;
      deduplicationId?: string;
    },
  ): Promise<string | undefined> {
    const cmd = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
      ...(options?.messageGroupId && {
        MessageGroupId: options.messageGroupId,
      }),
      ...(options?.deduplicationId && {
        MessageDeduplicationId: options.deduplicationId,
      }),
    });

    try {
      const reply = await this.sqsConfig.client.send(cmd);
      return reply.MessageId;
    } catch (e) {
      ExceptionHandler.handle(e);
    }
  }

  async receive(queueUrl: string) {
    const cmd = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
      VisibilityTimeout: 60,
      MessageAttributeNames: ['All'],
    });

    try {
      const reply = await this.sqsConfig.client.send(cmd);
      return reply.Messages ?? [];
    } catch (e) {
      this.logger.log('Error receiving messages from SQS', e);
      return [];
    }
  }

  async delete(queueUrl: string, receiptHandle: string) {
    const cmd = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });
    await this.sqsConfig.client.send(cmd);
  }

  // Event bus to trigger publish
  @OnEvent(PlatformEvents.pub_sqs_msg, { async: true })
  async handle(event: PublishSQSMessage) {
    await this.publish(event.queueUrl, event.payload, {
      messageGroupId: event.fifo?.groupId,
      deduplicationId: event.fifo?.deduplicationId,
    });
  }
}
