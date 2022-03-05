import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';
declare const ApikeyStrategy_base: new (...args: any[]) => HeaderAPIKeyStrategy;
export declare class ApikeyStrategy extends ApikeyStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
}
export {};
