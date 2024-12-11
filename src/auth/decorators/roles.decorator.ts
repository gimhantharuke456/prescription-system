import { SetMetadata } from '@nestjs/common';
export enum Role {
  CLIENT = 'client',
  PHARMACIST = 'pharmacist',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
