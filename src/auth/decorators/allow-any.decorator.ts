import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANY_KEY = 'allow-any';
export const AllowAny = () => SetMetadata(ALLOW_ANY_KEY, true);
