import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcrypt';
import { User } from 'src/core/models/user.model';
import { ROLES } from 'src/core/types/enum.types';

export class SeederService implements OnModuleInit {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}
  async seedAll() {
    await this.seedUsers();
  }
  async seedUsers() {
    const username = process.env.SUPERADMIN_USERNAME;
    const password = process.env.SUPERADMIN_PASSWORD;
    const email = process.env.SUPERADMIN_EMAIL;
    const superadminUser = await this.userModel.findOne({
      where: { username },
    });

    if (!superadminUser) {
      const hashedPassword = await bcrypt.hash(password!, +!process.env.HASH);
      await this.userModel.create({
        username: username!,
        password_hash: hashedPassword,
        email: email!,
        role: ROLES.SUPERADMIN,
      });

      console.log('Superadmin created!');
    }
  }
  async onModuleInit() {
    try {
      await this.seedAll();
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
}
