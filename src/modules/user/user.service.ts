import {
  Body,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/core/models/user.model';
import { deleteFile } from 'src/common/utils/delte.file';
import { join } from 'path';
import { ROLES } from 'src/core/types/enum.types';
import { where } from 'sequelize';
import { FindOptions } from 'sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}
  async findAll(role?: string) {
    let options: FindOptions = {
      attributes: ['id', 'username', 'email', 'role'],
      raw: true,
    };
    if (role) {
      options.where = { role };
    }
    const users = await this.userModel.findAll(options);

    return {
      message: 'Success',
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user)
      throw new NotFoundException('User with the specified id not found!');

    return {
      message: 'Success',
      data: {
        id: user!.id,
        username: user!.username,
        email: user!.email,
        role: user!.role,
      },
    };
  }
  async add_admin(id: string) {
    const superadmin = await this.userModel.findOne({
      where: { role: ROLES.SUPERADMIN },
    });
    const user = await this.userModel.findByPk(id);
    if (!user)
      throw new NotFoundException('User with the specified id not found!');
    if (user.id === superadmin!.id)
      throw new ConflictException(
        'You can not set superadmin to admin as there must be a superadmin all the time!',
      );
    user.role = ROLES.ADMIN;
    await user.save();
    return {
      message: "User's role has been promoted!",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: ROLES.ADMIN,
      },
    };
  }
  async delete_adim(id: string) {
    const superadmin = await this.userModel.findOne({
      where: { role: ROLES.SUPERADMIN },
    });
    const user = await this.userModel.findByPk(id);
    if (!user)
      throw new NotFoundException('User with the specified id not found!');
    if (user.id === superadmin!.id)
      throw new ConflictException(
        'You can not set superadmin to user as there must be a superadmin all the time!',
      );
    user.role = ROLES.USER;
    await user.save();
    return {
      message: "User's role has been demoted!",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: ROLES.USER,
      },
    };
  }
  async Profile_update(
    id: number,
    updateUserDto: UpdateUserDto,
    avatar_url?: any,
  ) {
    let user = await this.userModel.findByPk(id);

    if (avatar_url) {
      if (user!.avatar_url)
        deleteFile(join(process.cwd(), 'uploads', 'avatars', user!.avatar_url));

      user!.avatar_url = avatar_url;
    }
    Object.assign(user!, updateUserDto);

    await user!.save();

    return {
      message: 'Profofile successfully updated!',
    };
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);

    if (user!.role == ROLES.SUPERADMIN) {
      throw new ForbiddenException(
        'It can never be deleted because this is the SuperAdmin!',
      );
    }
    if (!user) {
      throw new NotFoundException(`User with id=${id} topilmadi`);
    }
    const avatarPath = join(
      process.cwd(),
      'uploads',
      'avatars',
      user.avatar_url,
    );
    await user.destroy({ hooks: true });

    if (user.avatar_url) {
      deleteFile(avatarPath);
    }
    return {
      message: 'User successfully deleted',
    };
  }
}
