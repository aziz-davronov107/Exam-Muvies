import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtAccessStrategy } from 'src/core/guards/jwt_access_strategy';
import { User } from 'src/core/models/user.model';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [JwtAccessStrategy],
  exports: [PassportModule, SequelizeModule],
})
export class GlobalModule {}
