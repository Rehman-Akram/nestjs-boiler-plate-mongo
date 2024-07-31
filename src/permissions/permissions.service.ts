import { Injectable, Logger } from '@nestjs/common';
import { PermissionObject } from './permission.interface';
import { PermissionKeys, PermissionLevel } from './permissions.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { Role } from '../roles/schemas/role.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  /**
   * This function is used to create permission in the database while creation of role.
   *
   * @param permission
   * @returns
   */
  async create(permissions: {
    [key in PermissionKeys]: PermissionLevel;
  }): Promise<Permission> {
    try {
      const permissionObject = this.getPermissions(
        permissions,
      ) as unknown as Permission;
      const permissionInstance = new this.permissionModel(permissionObject);
      return await permissionInstance.save();
    } catch (error) {
      Logger.error(
        `Error in create of PermissionsService where permission: ${JSON.stringify(permissions)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to update single permission while taking permissionObject
   *
   * @param options
   * @param data
   * @returns PermissionEntity
   */
  async update(
    options: any,
    permissions: {
      [key in PermissionKeys]: PermissionLevel;
    },
  ): Promise<Permission> {
    try {
      const newPermissionsObject = this.getPermissions(
        permissions,
      ) as unknown as Permission;
      await this.permissionModel.updateOne(options, newPermissionsObject);
      return this.permissionModel.findOne(options).exec();
    } catch (error) {
      Logger.error(
        `Error in update of PermissionsService where options: ${JSON.stringify(
          options,
        )} and data: ${JSON.stringify(permissions)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to get transformed permissions object
   *
   * @param permissions
   * @returns object
   */
  getPermissions(permissions: {
    [key in PermissionKeys]: PermissionLevel;
  }): PermissionObject {
    const permissionObject = {};
    for (const key in permissions) {
      if (permissions[key] === PermissionLevel.FULL_ACCESS) {
        permissionObject[key] = {
          create: true,
          read: true,
          update: true,
          delete: true,
        };
      } else if (permissions[key] === PermissionLevel.PARTIAL) {
        permissionObject[key] = {
          create: false,
          read: true,
          update: true,
          delete: false,
        };
      } else if (permissions[key] === PermissionLevel.VIEW) {
        permissionObject[key] = {
          create: false,
          read: true,
          update: false,
          delete: false,
        };
      } else {
        permissionObject[key] = {
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      }
    }
    return permissionObject as PermissionObject;
  }

  /**
   * This function is used to merge permissions of user roles and user groups
   *
   * @param rolePermissions
   * @param groupPermissions
   * @returns
   */
  mergePermissionObjects(rolePermissions) {
    try {
      const permissionsObject = {};

      const allPermissionTypes = [...Object.keys(rolePermissions)];
      const CRUD = ['create', 'read', 'update', 'delete'];

      allPermissionTypes.forEach((permissionType) => {
        permissionsObject[permissionType] = {};
        CRUD.forEach((key) => {
          permissionsObject[permissionType][key] =
            rolePermissions[permissionType]?.[key];
        });
      });

      return permissionsObject;
    } catch (error) {
      Logger.error(
        `Error in mergePermissionObjects of AuthService where rolePermissions: ${JSON.stringify(
          rolePermissions,
        )}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to merge permissions of user groups
   *
   * @param userGroups
   * @returns
   */
  mergeGroupPermissions(userGroups) {
    try {
      return userGroups.reduce((permissions, userGroup) => {
        const groupPermissionTypes = userGroup.group.permission;

        Object.keys(groupPermissionTypes).forEach((permissionType) => {
          const groupPermissions = groupPermissionTypes[permissionType];

          Object.keys(groupPermissions).forEach((permission) => {
            if (!permissions[permissionType]) {
              permissions[permissionType] = {
                [permission]: groupPermissions[permission],
              };
            } else {
              permissions[permissionType][permission] =
                permissions[permissionType][permission] ||
                groupPermissions[permission];
            }
          });
        });

        return permissions;
      }, {});
    } catch (error) {
      Logger.error(
        `Error in mergeGroupPermissions of AuthService where userGroups: ${JSON.stringify(
          userGroups,
        )}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to merge permissions of user roles
   *
   * @param userRoles
   * @returns
   */
  mergeRolePermissions(roles) {
    try {
      return roles.reduce((permissions, role) => {
        const rolePermissionTypes = role.permission;

        Object.keys(rolePermissionTypes).forEach((permissionType) => {
          const rolePermissions = rolePermissionTypes[permissionType];

          Object.keys(rolePermissions).forEach((permission) => {
            if (!permissions[permissionType]) {
              permissions[permissionType] = {
                [permission]: rolePermissions[permission],
              };
            } else {
              permissions[permissionType][permission] =
                permissions[permissionType][permission] ||
                rolePermissions[permission];
            }
          });
        });

        return permissions;
      }, {});
    } catch (error) {
      Logger.error(
        `Error in mergeRolePermissions of AuthService where roles: ${JSON.stringify(
          roles,
        )}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to merge permissions of user roles and user groups
   *
   * @param userRoles
   * @param userGroups
   * @returns
   */
  mergePermissions(roles: Role[]) {
    try {
      const rolePermissions = this.mergeRolePermissions(roles);
      const mergePermissionObject =
        this.mergePermissionObjects(rolePermissions);
      delete mergePermissionObject['id'];
      return mergePermissionObject;
    } catch (error) {
      Logger.error(
        `Error in mergePermissions of AuthService where Roles: ${JSON.stringify(
          roles,
        )}`,
      );
      throw error;
    }
  }
}
