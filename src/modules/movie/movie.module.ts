import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from 'src/core/models/movie.model';
import { MovieFile } from 'src/core/models/movie-file.model';
import { UserSubscription } from 'src/core/models/user-subscription.model';
import { SubscriptionPlan } from 'src/core/models/subscription-plan.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Movie,
      MovieFile,
      UserSubscription,
      SubscriptionPlan,
      MovieFile,
    ]),
  ],

  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
