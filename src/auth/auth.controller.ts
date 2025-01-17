import { Body, Controller, Get, Post, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../shared/decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseFormat } from '../shared/shared.interface';
import { ResponseFormatService } from '../shared/response-format.service';
import { MESSAGES, PERMISSIONS } from '../shared/constants/constants';
import { UserWithToken } from './dto/user-with-token.dto';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginUser: LoginUserDto,
  ): Promise<ResponseFormat<UserWithToken>> {
    const userWithToken = await this.authService.loginUser(loginUser);
    return ResponseFormatService.responseOk<UserWithToken>(
      userWithToken,
      MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
    );
  }
  @SetMetadata('permissions', [{ [PERMISSIONS.ROLES]: { create: true } }])
  @Get('who-am-i')
  async whoAmI(
    @CurrentUser() currentUser: User,
  ): Promise<ResponseFormat<User>> {
    return ResponseFormatService.responseOk<User>(
      currentUser,
      MESSAGES.QUERY_SUCCESS,
    );
  }
}
