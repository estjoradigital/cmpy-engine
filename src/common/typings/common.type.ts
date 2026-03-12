export interface PublishSQSMessage {
  queueUrl: string;
  payload: unknown;
  fifo?: {
    groupId: string;
    deduplicationId: string;
  };
}
