import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';

@Controller('drugs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  @Roles(Role.PHARMACIST)
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(createDrugDto);
  }

  @Get()
  @Roles(Role.PHARMACIST, Role.CLIENT)
  findAll(@Query('name') name?: string) {
    if (name) {
      return this.drugsService.findByName(name);
    }
    return this.drugsService.findAll();
  }

  @Get('available')
  @Roles(Role.PHARMACIST, Role.CLIENT)
  findAvailableDrugs() {
    return this.drugsService.findAvailableDrugs();
  }

  @Get(':id')
  @Roles(Role.PHARMACIST, Role.CLIENT)
  findOne(@Param('id') id: string) {
    return this.drugsService.findById(id);
  }

  @Put(':id')
  @Roles(Role.PHARMACIST)
  update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugsService.update(id, updateDrugDto);
  }

  @Delete(':id')
  @Roles(Role.PHARMACIST)
  remove(@Param('id') id: string) {
    return this.drugsService.remove(id);
  }
}
