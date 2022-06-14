import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { UploadTypes } from '../shared/types/upload.types';
import { HttpError, HttpErrorCode } from '../shared/error/HttpError';

@Injectable()
export class GoogleService {
  storage: Storage = undefined;

  constructor(private readonly configService: ConfigService) {
    if (!this.storage) {
      this.storage = new Storage({
        projectId: configService.get('google.storage.project_name'),
        credentials: {
          private_key: configService
            .get('google.storage.private_key')
            .toString()
            .replace(/\\n/g, '\n'),
          client_email: configService.get('google.storage.client_email'),
        },
      });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    name: string,
    type: UploadTypes,
  ): Promise<string> {
    if (file.size > 500000) {
      throw new BadRequestException(
        HttpError.getHttpError(HttpErrorCode.FILE_TOO_BIG),
      );
    }
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png'
    ) {
      throw new BadRequestException(
        HttpError.getHttpError(HttpErrorCode.FILE_FORMAT),
      );
    }
    try {
      const bucket = this.storage.bucket(this.configService.get('bucket_name'));
      const folder = GoogleService.getFolder(type);
      const path = folder + name + '.jpg';
      const fileCloud = this.storage
        .bucket(this.configService.get('bucket_name'))
        .file(path);
      await fileCloud.save(file.buffer, {
        contentType: 'image/jpg',
      });
      return `https://storage.googleapis.com/${bucket.name}/${path}`;
    } catch (e) {
      throw new InternalServerErrorException(
        HttpError.getHttpError(HttpErrorCode.FAIL_UPLOAD),
      );
    }
  }

  async deleteFile(name: string, type: UploadTypes) {
    try {
      const bucket = this.storage.bucket(this.configService.get('bucket_name'));
      const folder = GoogleService.getFolder(type);
      const path = folder + name + '.jpg';
      const fileCloud = bucket.file(path);
      await fileCloud.delete();
    } catch (e) {}
  }

  private static getFolder(type: UploadTypes) {
    switch (type) {
      case UploadTypes.POST:
        return 'posts/';
      case UploadTypes.USER:
        return 'users/';
      default:
        return '';
    }
  }
}
