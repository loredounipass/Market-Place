import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {



    // VERIFICA LA AUTENTICACIÓN LOCAL
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        return result;
    }
}