import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BasicGuard } from './basic.guard';
import { UserID } from './user.decorator';
import { TokenService } from '../token/token.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('login')
  @UseGuards(BasicGuard)
  login(@UserID() userId: number, @Res({ passthrough: true }) res: Response) {
    try {
      const token = this.tokenService.createToken(userId);

      res.cookie('access_token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      res.cookie('is-logged', true, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      // Zwrócenie odpowiedzi z sukcesem
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error during login',
      });
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('is-logged');
  }
}
