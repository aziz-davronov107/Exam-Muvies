import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './common/mailer/mailer.module';
import { RedisModule } from './common/redis/redis.module';
import { User } from './core/models/user.model';
import { GlobalModule } from './common/utils/global.module';
import { APP_GUARD } from '@nestjs/core';
import { Movie } from './core/models/movie.model';
import { UserSubscription } from './core/models/user-subscription.model';
import { MovieFile } from './core/models/movie-file.model';
import { WatchHistory } from './core/models/watch-history.model';
import { Category } from './core/models/category.model';
import { Favorite } from './core/models/favorite.model';
import { Payment } from './core/models/payment.model';
import { Review } from './core/models/review.model';
import { JwtAccessStrategy } from './core/guards/jwt_access_strategy';
import { JwtAccessAuthGuard } from './core/guards/auth.guards';
import { SubscriptionPlan } from './core/models/subscription-plan.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        models: [ User,
          Movie,
          UserSubscription,
          SubscriptionPlan,
          MovieFile,
          WatchHistory,
          Category,
          Favorite,
          Payment,
          Review
        ],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    GlobalModule,
    AuthModule,
    MailerModule,
    RedisModule,
  ],
  providers: [
    JwtAccessStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
  ],
})
export class AppModule {}
