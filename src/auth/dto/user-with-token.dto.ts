import { User } from 'src/users/schemas/user.schema';

export class UserWithToken {
  user: User;
  accessToken: string;
}
