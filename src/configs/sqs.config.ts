import { SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SQSConfig {
  private cfg: SQSClient;

  constructor(private readonly configService: ConfigService) {
    this.cfg = new SQSClient({
      region: this.configService.getOrThrow<string>('AWS_SQS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_KEY'),
      },
    });
  }

  get client() {
    return this.cfg;
  }
}
