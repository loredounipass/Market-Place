import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { VerifyTokenDto } from 'src/two-factor/dto';
import { UserService } from '../user/user.service';
import { HashService } from '../user/hash.service';
import { TwoFactorAuthService } from '../two-factor/verification.module';
import { EmailService } from '../user/email.service';


// This service handles authentication-related operations such as validating user credentials, logging in users, and verifying two-factor authentication tokens. It interacts with the UserService to retrieve user information, HashService to compare passwords, TwoFactorAuthService to manage 2FA tokens, and EmailService to send login notifications. The service provides methods for validating user credentials, performing login operations, and verifying 2FA tokens before allowing access to protected resources.
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly emailService: EmailService,
  ) {}



  // VALIDA LAS CREDENCIALES DEL USUARIO
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && await this.hashService.comparePassword(password, user.password)) {
      const { password: _p, ...safeUser } = (user as any).toObject ? user.toObject() : user;
      return safeUser;
    }
    return null;
  }



  // INICIA LA SESIÓN DEL USUARIO
  async login(user: any, req: any): Promise<any> {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    if ((user as any).isTokenEnabled) {
      await this.twoFactorAuthService.sendToken((user as any).email);
      return { requires2FA: true, msg: 'Verification code sent to your email.' };
    }

    return this.performLogin(user, req);
  }



  // VERIFICA EL TOKEN DE 2FA E INICIA SESIÓN
  async verifyAndLogin(verifyTokenDto: VerifyTokenDto, req: any): Promise<any> {
    const { email, token } = verifyTokenDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found.');
    if (!user.isTokenEnabled) throw new UnauthorizedException('2FA is not enabled.');

    const { isValid, message } = await this.twoFactorAuthService.verifyToken(email, token);
    if (!isValid) {
      throw new UnauthorizedException(message || 'Invalid or expired code.');
    }

    return this.performLogin(user, req);
  }



  // REALIZA EL PROCESO DE INICIO DE SESIÓN Y REGENERACIÓN DE SESIÓN
  private performLogin(user: any, req: any) {
    return new Promise((resolve, reject) => {
      const session = req.session;
      if (session) {
        session.regenerate((err) => {
          if (err) return reject(new UnauthorizedException('Error logging in.'));

          req.login(user, async (err) => {
            if (err) return reject(new UnauthorizedException('Error logging in.'));

            void this.emailService.sendLoginNotificationEmail((user as any).email).catch(console.error);

            resolve({ msg: 'Logged in!' });
          });
        });
      } else {
        req.login(user, async (err) => {
          if (err) return reject(new UnauthorizedException('Error logging in.'));

          void this.emailService.sendLoginNotificationEmail((user as any).email).catch(console.error);

          resolve({ msg: 'Logged in!' });
        });
      }
    });
  }
}
