import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  UnsupportedMediaTypeException,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorators';
import { ROLES } from 'src/core/types/enum.types';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Get('ping')
  get() {
    return 'Pong';
  }
  @Get('get_all')
  findAll(@Req() req: Request) {
    let role = (req as any).user.role;
    if (role == ROLES.SUPERADMIN) {
      return this.userService.findAll();
    }
    return this.userService.findAll(role);
  }

  @Get('get_one')
  findOne(@Req() req: Request) {
    let id = (req as any).user.user_id;
    return this.userService.findOne(id);
  }

  @Put(':id/add-admin')
  addAdmin(@Param('id') id: string) {
    return this.userService.add_admin(id);
  }

  @Put(':id/remove-admin')
  deleteAdmin(@Param('id') id: string) {
    return this.userService.delete_adim(id);
  }

  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, callback) => {
        let OnlyType = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!OnlyType.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException(
              `Uploads Only this Type ${OnlyType}`,
            ),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  @Put('profile_update')
  Profile_update(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile('avatar') avatar: Express.Multer.File,
  ) {
    return this.userService.Profile_update(
      (req as any).user.user_id,
      updateUserDto,
      avatar,
    );
  }

  @Delete('delete')
  remove(@Req() req: Request) {
    return this.userService.remove((req as any).user.user_id);
  }
}
