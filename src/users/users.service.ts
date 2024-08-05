import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserStatus } from './enums/status.enum';
import { ERRORS } from '../shared/constants/constants';
import { NotFoundError } from '../shared/errors';
import { Role } from '../roles/schemas/role.schema';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly permissionService: PermissionsService,
  ) {}

  /**
   * This function is used to find user by means of _id which is not active
   *
   * @param _id
   * @returns user | null
   */
  async findOneById(_id: string): Promise<User | null> {
    try {
      const user = (
        await this.userModel
          .findOne({
            _id,
            status: UserStatus.ACTIVE,
          })
          .populate({
            path: 'roles',
            populate: {
              path: 'permission',
            },
          })
          .exec()
      ).toObject();

      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      // add user permissions to user object
      const userRoles = user.roles as unknown as Role[];
      user['permissions'] = this.permissionService.mergePermissions(userRoles);
      return user;
    } catch (error) {
      Logger.error(`Error in findOneById of user service where _id: ${_id}`);
      throw error;
    }
  }

  /**
   * This function is used to find and return user by email address.
   *
   * @param email
   * @param isPasswordRequired if this is true it will also returns user password
   * @returns User
   */
  async findUserByEmail(
    email: string,
    isPasswordRequired?: boolean,
  ): Promise<User> {
    try {
      const query = this.userModel
        .findOne({ email, status: UserStatus.ACTIVE })
        .populate({
          path: 'roles',
          populate: {
            path: 'permission',
          },
        });
      if (isPasswordRequired) {
        query.select('+password');
      }
      const user = (await query.exec()).toObject();
      return user;
    } catch (error) {
      Logger.error(
        `Error in findUserByEmail of user service where credentials: ${JSON.stringify(
          {
            email,
            isPasswordRequired,
          },
        )}`,
      );
      throw error;
    }
  }
}
