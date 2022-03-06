import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { UploadTypes } from '../shared/types/upload.types';

@Injectable()
export class GoogleService {
  constructor(private readonly configService: ConfigService) {}

  storage = new Storage({
    projectId: 'fordblog',
    keyFilename: './fordblog-bfc482c198ea.json',
  });

  async uploadFile(
    file: Express.Multer.File,
    slug: string,
    type: UploadTypes,
  ): Promise<string> {
    if (file.size > 500000) {
      throw new BadRequestException('File is to big');
    }
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png'
    ) {
      throw new BadRequestException('File format not supported');
    }
    console.log(file);
    try {
      const bucket = this.storage.bucket(this.configService.get('bucket_name'));
      let folder;
      switch (type) {
        case UploadTypes.POST:
          folder = 'posts/';
          break;
        case UploadTypes.USER:
          folder = 'users/';
          break;
        default:
          folder = '';
          break;
      }
      const path = folder + slug + '.jpg';
      const fileCloud = this.storage
        .bucket(this.configService.get('bucket_name'))
        .file(path);
      await fileCloud.save(file.buffer, {
        contentType: 'image/jpg',
      });
      return `https://storage.googleapis.com/${bucket.name}/${folder}${path}`;
    } catch (e) {
      throw new InternalServerErrorException('File upload failed');
    }
  }
}
