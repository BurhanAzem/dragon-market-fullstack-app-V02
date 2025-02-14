import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // We'll inject UserService from here

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'MY_SECRET_KEY', // In real apps, use env var
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
