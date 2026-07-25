import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(body: any) {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    return this.usersService.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role || 'ADMIN',
    });
  }

  async login(body: any) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: 'dummy-jwt-token'
    };
  }
}