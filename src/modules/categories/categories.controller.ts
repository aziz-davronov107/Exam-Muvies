import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/core/decorators/public.decorators';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorators';
import { ROLES } from 'src/core/types/enum.types';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add/category')
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('get_all')
  @Public()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('get_one/:id')
  @Public()
  @ApiParam({ name: 'id', required: true, type: String })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put('update/:id')
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @ApiParam({ name: 'id', required: true, type: String })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete('delete/:id')
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @ApiParam({ name: 'id', required: true, type: String })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
