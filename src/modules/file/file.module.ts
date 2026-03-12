import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from '@/utils';
import { FileConfig, PrismaConfig } from '@/configs';
import { S3Entity } from '../../utils/file/s3.file';

@Module({
  controllers: [FileController],
  providers: [FileService, FileEntity, PrismaConfig, FileConfig, S3Entity],
})
export class FileModule {}
