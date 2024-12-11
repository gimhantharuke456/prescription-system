// src/users/users.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get current user profile
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive information
    const { ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  // Update current user profile
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    // Prevent changing email or user type
    if (updateUserDto.email || updateUserDto.userType) {
      throw new ForbiddenException('Cannot update email or user type');
    }

    const updatedUser = await this.usersService.updateUser(
      req.user.userId,
      updateUserDto,
    );

    const { ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }

  // Admin-only routes
  @Get()
  @Roles(Role.PHARMACIST)
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      const { ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
