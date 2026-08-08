import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { HashService } from './hash.service';
import * as crypto from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { EmailService } from './email.service';



// SERVICIO PARA MANEJAR OPERACIONES DEL USUARIO
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}



  // OBTIENE UN USUARIO POR SU CORREO ELECTRÓNICO
  getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }



  // OBTIENE UN USUARIO POR SU ID
  getUserById(id: string) {
    return this.userRepository.findById(id);
  }



  // REGISTRA UN NUEVO USUARIO Y HASHEA SU CONTRASEÑA
  async register(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const user = await this.getUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException("This email is already registered");
    }

    const createUser = {
      ...createUserDto,
      password: await this.hashService.hashPassword(createUserDto.password),
    };
    return this.userRepository.create(createUser);
  }



  // VERIFICA SI EL CORREO ELECTRÓNICO DEL USUARIO ESTÁ VERIFICADO
  async isEmailVerified(email: string): Promise<{ isVerified: boolean; message: string }> {
    const user = await this.getUserByEmail(email);
    if (!user) {
        throw new BadRequestException('The user with the provided email does not exist.');
    }
    
    if (user.isValid) {
        return { isVerified: true, message: 'Email verified successfully.' };
    } else {
        return { isVerified: false, message: 'The email is not yet verified.' };
    }
}



// VERIFICA EL CORREO ELECTRÓNICO MEDIANTE UN TOKEN
async verifyEmail(email: string, token: string): Promise<boolean> {
  const user = await this.getUserByEmail(email);
  
  if (!user) {
      throw new BadRequestException('User does not exist.');
  }
  
  if (user.isValid) {
      throw new BadRequestException('Email already verified.');
  }

  if (!user.verifyEmailTokenHash || !user.verifyEmailExpires || user.verifyEmailExpires < new Date()) {
      throw new BadRequestException('The token is invalid or has expired.');
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  if (user.verifyEmailTokenHash !== tokenHash) {
      throw new BadRequestException('The token is invalid or has expired.');
  }
  
  try {
      user.isValid = true;
      user.verifyEmailTokenHash = undefined;
      user.verifyEmailExpires = undefined;
      await user.save();
      return true;
  } catch {
      throw new BadRequestException('Error verifying email.');
  }
}



// ENVÍA UN CORREO DE VERIFICACIÓN
async sendVerificationEmail(email: string): Promise<boolean> {
  const user = await this.getUserByEmail(email);
  
  if (!user) {
      throw new BadRequestException('User does not exist.');
  }

  if (user.isValid) {
      throw new BadRequestException('Email already verified. Cannot resend.');
  }
  
  try {
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      user.verifyEmailTokenHash = tokenHash;
      user.verifyEmailExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      await this.emailService.sendVerificationEmail(user.email, token);
      return true;
  } catch {
      throw new BadRequestException('Error sending email.');
  }
}



// ACTUALIZA EL ESTADO DEL TOKEN DE DOS FACTORES
  async updateTokenStatus(email: string, isTokenEnabled: boolean) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    user.isTokenEnabled = isTokenEnabled;
    await user.save();
    return { msg: 'Account security updated successfully.' };
  }



// OBTIENE EL ESTADO DEL TOKEN DE DOS FACTORES
  async getTokenStatus(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return { isTokenEnabled: !!user.isTokenEnabled };
  }



  // ACTUALIZA EL IDIOMA DEL USUARIO
  async updateLanguage(email: string, language: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    user.language = language;
    await user.save();
    return { msg: 'Language updated successfully.' };
  }



  // OBTIENE EL IDIOMA DEL USUARIO
  async getUserLanguage(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return { language: user.language || 'es' };
  }



// CAMBIA LA CONTRASEÑA DEL USUARIO
  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.hashService.comparePassword(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSameAsCurrent = await this.hashService.comparePassword(changePasswordDto.newPassword, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestException('The new password cannot be the same as the previous one');
    }

    const TEN_MINUTES_MS = 10 * 60 * 1000;
    if (user.lastPasswordChange) {
      const elapsed = Date.now() - user.lastPasswordChange;
      if (elapsed < TEN_MINUTES_MS) {
        const remainingMinutes = Math.ceil((TEN_MINUTES_MS - elapsed) / (60 * 1000));
        throw new BadRequestException(`You cannot change the password until ${remainingMinutes} minute(s) have passed since the last change.`);
      }
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new BadRequestException('The new passwords do not match');
    }

    user.password = await this.hashService.hashPassword(changePasswordDto.newPassword);
    user.lastPasswordChange = Date.now();
    await user.save();
    return { message: 'Password updated successfully' };
  }



// ACTUALIZA EL PERFIL DEL USUARIO
  async updateProfile(email: string, updateProfileDto: UpdateProfileDto, req?: any) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const TEN_MINUTES_MS = 10 * 60 * 1000;
    if (user.lastProfileUpdate) {
      const elapsed = Date.now() - user.lastProfileUpdate;
      if (elapsed < TEN_MINUTES_MS) {
        const remainingMinutes = Math.ceil((TEN_MINUTES_MS - elapsed) / (60 * 1000));
        throw new BadRequestException(`You cannot update your profile until ${remainingMinutes} minute(s) have passed since the last update.`);
      }
    }

    const providedFirstName = updateProfileDto.firstName !== undefined && updateProfileDto.firstName !== null;
    const providedLastName = updateProfileDto.lastName !== undefined && updateProfileDto.lastName !== null;
    const providedEmail = updateProfileDto.email !== undefined && updateProfileDto.email !== null;

    const firstNameChanged = providedFirstName && updateProfileDto.firstName !== user.firstName;
    const lastNameChanged = providedLastName && updateProfileDto.lastName !== user.lastName;
    const emailChanged = providedEmail && updateProfileDto.email !== user.email;

    if (!firstNameChanged && !lastNameChanged && !emailChanged) {
      if ((providedFirstName || providedLastName) && !providedEmail) {
        throw new BadRequestException('You must use different names than the previous one');
      } else if (providedEmail && !providedFirstName && !providedLastName) {
        throw new BadRequestException('You must use a different email than the previous one');
      } else {
        throw new BadRequestException('You must provide different values than the current ones');
      }
    }

    if (providedEmail && emailChanged) {
      const existingUser = await this.userRepository.findOne({ email: updateProfileDto.email });
      if (existingUser && existingUser.email !== email) {
        throw new BadRequestException('The email is already in use');
      }
      user.email = updateProfileDto.email!;
      user.isValid = false;
    }

    if (firstNameChanged) user.firstName = updateProfileDto.firstName!;
    if (lastNameChanged) user.lastName = updateProfileDto.lastName!;

    user.lastProfileUpdate = Date.now();
    await user.save();

    const result = { message: 'Profile updated successfully' };

    if (req) {
      const updatedUser = await this.getUserByEmail(updateProfileDto.email || email);
      if (!updatedUser) {
        throw new BadRequestException('Error updating user session.');
      }

      return new Promise((resolve, reject) => {
        req.login(updatedUser, (err) => {
          if (err) {
            reject(new BadRequestException('Error updating user session.'));
          } else {
            resolve(result);
          }
        });
      });
    }

    return result;
  }



   // BUSCA USUARIOS POR EMAIL, NOMBRE, O ID
  async searchUsers(q: string) {
    if (!q) return [];
    
    const sanitized = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!sanitized) return [];
    
    const regex = new RegExp(sanitized, 'i');
    const or: any[] = [
      { email: regex },
      { firstName: regex },
      { lastName: regex },
    ];

    if (/^[0-9a-fA-F]{24}$/.test(q)) {
      or.push({ _id: q });
    }

    const MAX_LIMIT = 20;
    const users = await this.userRepository.find({ $or: or }).limit(MAX_LIMIT).select('_id firstName lastName email language').lean().exec();

    return users.map((u: any) => {
      const { _id, firstName, lastName, email, language } = u;
      return { _id, firstName, lastName, email, language };
    });
  }

}
