import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class AuthGuardMock implements CanActivate {
    canActivate(): boolean | Promise<boolean> | Observable<boolean>;
}
