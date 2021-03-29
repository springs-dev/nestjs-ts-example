import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersRolesEnum } from '../../auth/enumerables/users-roles.enum';

export interface UserType {
  id?: number;
  role: UsersRolesEnum;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
