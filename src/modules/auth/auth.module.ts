import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.models';
import { JwtModule } from '@nestjs/jwt';
import { JwtSecret } from 'src/common/utils/jwt.secret';
import { JwtAccessStrategy } from 'src/core/guards/jwt_access_strategy';
import { JwtRefreshStrategy } from 'src/core/guards/jwt_refresh_strategy';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register(JwtSecret.getAccessOptions()),
  ],
  providers: [AuthService,JwtRefreshStrategy,JwtAccessStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
