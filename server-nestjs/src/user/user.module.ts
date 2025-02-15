import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],  // so AuthService can inject it
})
export class UserModule {
  id: number;
  name: string;
  email: string;
  password: string;
}
