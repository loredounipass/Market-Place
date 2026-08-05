import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        // Do not call `logIn` here to avoid creating a session before
        // two-factor token verification. Session creation is handled
        // explicitly after successful 2FA verification in the auth service.
        return result;
    }
}