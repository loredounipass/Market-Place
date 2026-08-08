import { createParamDecorator, ExecutionContext } from '@nestjs/common';



// OBTIENE EL USUARIO ACTUAL
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
