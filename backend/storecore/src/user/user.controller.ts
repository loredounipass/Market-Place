import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  Patch
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AuthService } from '../auth/auth.service';
import { TwoFactorAuthService } from '../two-factor/verification.module';
import { UserService } from './user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyTokenDto } from 'src/two-factor/dto';
import { LocalAuthGuard } from '../guard/auth/local-auth.guard';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';
import { EmailThrottlerGuard } from '../guard/auth/email-throttler.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { UpdateTokenStatusDto } from './dto/update-token-status.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ForgotPasswordService } from './forgot.password.service';
import { ResendTokenDto } from './dto/resend-token.dto';

// User controller for handling user-related routes such as registration, login, profile updates, and password management. It uses guards to protect certain routes and interacts with the UserService, AuthService, TwoFactorAuthService, and ForgotPasswordService to perform its operations.
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) { }



  // REGISTRA UN NUEVO USUARIO
  @UseGuards(EmailThrottlerGuard)
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }



  // INICIA LA SESIÓN DEL USUARIO
  @UseGuards(EmailThrottlerGuard, LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req) {
    // Passport has already validated credentials and populated `req.user`.
    return this.authService.login(req.user, req);
  }



  // VERIFICA EL TOKEN DE AUTENTICACIÓN
  @UseGuards(EmailThrottlerGuard)
  @Post('verify-token')
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto, @Request() req) {
    return this.authService.verifyAndLogin(verifyTokenDto, req);
  }



  // REENVÍA EL TOKEN DE AUTENTICACIÓN
  @UseGuards(EmailThrottlerGuard)
  @Post('resend-token')
  async resendToken(@Request() req, @Body() resendTokenDto: ResendTokenDto) {
    // Use email from authenticated session if available, otherwise from body (for 2FA flow)
    const email = req.user?.email || resendTokenDto.email;

    if (!email) {
      throw new BadRequestException('Email is required.');
    }

    try {
      await this.twoFactorAuthService.resendToken(email);
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      console.error('resendToken error:', e.message);
    }
    // Always return the same message to prevent email enumeration
    return { message: 'If the email exists, a verification code has been sent.' };
  }



  // ACTUALIZA EL ESTADO DE AUTENTICACIÓN DE DOS FACTORES
  @UseGuards(AuthenticatedGuard, EmailThrottlerGuard)
  @Patch('update-token-status')
  async updateTokenStatus(@Request() req, @Body() updateTokenStatusDto: UpdateTokenStatusDto) {
    const email = req.user.email;
    return this.userService.updateTokenStatus(email, updateTokenStatusDto.isTokenEnabled);
  }



  // OBTIENE EL ESTADO DE AUTENTICACIÓN DE DOS FACTORES
  @UseGuards(AuthenticatedGuard)
  @Get('token-status')
  async getTokenStatus(@Request() req) {
    const email = req.user.email;
    return this.userService.getTokenStatus(email);
  }



  // ACTUALIZA EL IDIOMA DEL USUARIO
  @UseGuards(AuthenticatedGuard, EmailThrottlerGuard)
  @Patch('language')
  async updateLanguage(@Request() req, @Body() updateLanguageDto: UpdateLanguageDto) {
    const email = req.user.email;
    return this.userService.updateLanguage(email, updateLanguageDto.language);
  }



  // OBTIENE EL IDIOMA DEL USUARIO
  @UseGuards(AuthenticatedGuard)
  @Get('language')
  async getUserLanguage(@Request() req) {
    const email = req.user.email;
    return this.userService.getUserLanguage(email);
  }



  // OBTIENE LA INFORMACIÓN DEL USUARIO AUTENTICADO
  @UseGuards(AuthenticatedGuard)
  @Get('info')
  getUsers(@Request() req) {
    // Make sure to use the plain object (depending on how Passport serializes)
    const userObj = req.user._doc || req.user;
    // Omitir campos altamente sensibles
    const { password, resetPasswordTokenHash, resetPasswordTokenPurpose, ...safeUser } = userObj;
    return {
      data: safeUser
    };
  }



  // CIERRA LA SESIÓN DEL USUARIO
  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Request() req) {
    req.logout((err) => {
      if (req.session) {
        req.session.destroy(() => { });
      }
    });
  }



  // CAMBIA LA CONTRASEÑA DEL USUARIO
  @UseGuards(AuthenticatedGuard, EmailThrottlerGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const email = req.user.email;
    return this.userService.changePassword(email, changePasswordDto);
  }



  // ACTUALIZA EL PERFIL DEL USUARIO
  @UseGuards(AuthenticatedGuard, EmailThrottlerGuard)
  @Post('update-profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const email = req.user.email;
    return this.userService.updateProfile(email, updateProfileDto, req);
  }



  // VERIFICA EL CORREO ELECTRÓNICO DEL USUARIO
  @UseGuards(AuthenticatedGuard, EmailThrottlerGuard)
  @Post('verify-email')
  async verifyEmail(@Request() req, @Body() body: { token: string }): Promise<{ message: string }> {
    const userEmail = req.user.email;
    if (!body || !body.token) {
      throw new BadRequestException('The verification token is required.');
    }
    try {
      const result = await this.userService.verifyEmail(userEmail, body.token);
      return { message: 'Email verified successfully.' };
    } catch (error: unknown) {
      const e = error instanceof Error ? error : new Error(String(error));
      throw new BadRequestException(e.message || 'The email could not be verified.');
    }
  }



  // ENVÍA UN CORREO DE VERIFICACIÓN
  @UseGuards(EmailThrottlerGuard, AuthenticatedGuard)
  @Post('send-verification-email')
  async sendVerificationEmail(@Request() req): Promise<{ message: string }> {
    const email = req.user.email;
    try {
      const result = await this.userService.sendVerificationEmail(email);
      return { message: 'Verification email sent successfully.' };
    } catch (error: unknown) {
      const e = error instanceof Error ? error : new Error(String(error));
      throw new BadRequestException(e.message || 'Could not send verification email.');
    }
  }



  // VERIFICA SI EL CORREO ELECTRÓNICO HA SIDO VERIFICADO
  @UseGuards(AuthenticatedGuard)
  @Get('is-email-verified')
  async isEmailVerified(@Request() req): Promise<{ isVerified: boolean; message: string }> {
    const email = req.user.email;
    return this.userService.isEmailVerified(email);
  }



  // BUSCA USUARIOS
  @UseGuards(EmailThrottlerGuard, AuthenticatedGuard)
  @Get('search')
  async searchUsers(@Request() req) {
    const q = typeof req.query === 'object' ? req.query.q : undefined;
    const results = await this.userService.searchUsers(q);
    return { data: results };
  }



  // SOLICITA EL RESTABLECIMIENTO DE CONTRASEÑA
  @UseGuards(EmailThrottlerGuard)
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    try {
      await this.forgotPasswordService.requestPasswordReset(email);
    } catch {
      // Swallow all errors to prevent email enumeration
    }
    return { message: 'Reset email sent if the user exists.' };
  }



  // RESTABLECE LA CONTRASEÑA DEL USUARIO
  @UseGuards(EmailThrottlerGuard)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, token, newPassword, confirmNewPassword } = body;
    try {
      return await this.forgotPasswordService.resetPassword(email, token, newPassword, confirmNewPassword);
    } catch (error: unknown) {
      const e = error instanceof Error ? error : new Error(String(error));
      throw new BadRequestException(e.message || 'Could not reset the password.');
    }
  }
}
