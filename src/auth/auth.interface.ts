import { PermissionObject } from '../permissions/permission.interface';

export interface TokenPayload {
  _id: string;
}

export interface UserPermission {
  [key: string]: PermissionObject;
}
