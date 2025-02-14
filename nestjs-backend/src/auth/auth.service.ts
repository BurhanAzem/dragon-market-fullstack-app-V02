import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user with email already exists
    const existingUser = this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // Create user
    const newUser = this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });
    return { message: 'User registered', user: newUser };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Create JWT
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { message: 'Login successful', token };
  }
}
