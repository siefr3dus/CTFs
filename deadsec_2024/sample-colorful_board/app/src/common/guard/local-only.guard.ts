import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LocalOnlyGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const clientIp = req.ip;
        const localIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

        if (localIps.includes(clientIp)) {
            return true;
        } else {
            throw new HttpException('Only Local!', 404);
        }
    }
}