import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessStrategy } from 'src/core/guards/jwt_access_strategy';
import { JwtAccessAuthGuard } from 'src/core/guards/auth.guards';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MailerModule } from 'src/common/mailer/mailer.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { User } from 'src/core/models/user.model';
import { Movie } from 'src/core/models/movie.model';
import { UserSubscription } from 'src/core/models/user-subscription.model';
import { SubscriptionPlan } from 'src/core/models/subscription-plan.model';
import { MovieFile } from 'src/core/models/movie-file.model';
import { WatchHistory } from 'src/core/models/watch-history.model';
import { Category } from 'src/core/models/category.model';
import { Favorite } from 'src/core/models/favorite.model';
import { Payment } from 'src/core/models/payment.model';
import { Review } from 'src/core/models/review.model';
import { UserModule } from './modules/user/user.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { RoleGuard } from './core/guards/role.guards';
import { MovieModule } from './modules/movie/movie.module';
import { SeederModule } from './common/seeders/seeder.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT'),
        database: configService.get('DB_DATABASE'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        port: configService.get('DB_PORT'),
        models: [
          User,
          Movie,
          UserSubscription,
          SubscriptionPlan,
          MovieFile,
          WatchHistory,
          Category,
          Favorite,
          Payment,
          Review,
        ],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),
    SequelizeModule.forFeature([User, Movie]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    SeederModule,
    AuthModule,
    MailerModule,
    UserModule,
    RedisModule,
    CategoriesModule,
    MovieModule,
    SubscriptionsModule,
  ],
  providers: [
    JwtAccessStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
