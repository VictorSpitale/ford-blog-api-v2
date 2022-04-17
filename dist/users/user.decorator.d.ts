import { UserDto } from './dto/user.dto';
export declare const AuthUser: (...dataOrPipes: (keyof UserDto | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
