import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drug } from './schemas/drug.schema';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';

@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug.name) private drugModel: Model<Drug>) {}

  async create(createDrugDto: CreateDrugDto): Promise<Drug> {
    // Check if drug with same name already exists
    const existingDrug = await this.drugModel.findOne({
      name: createDrugDto.name,
    });

    if (existingDrug) {
      throw new ConflictException(
        `Drug with name ${createDrugDto.name} already exists`,
      );
    }

    const createdDrug = new this.drugModel(createDrugDto);
    return createdDrug.save();
  }

  async findAll(query?: any): Promise<Drug[]> {
    return this.drugModel.find(query).exec();
  }

  async findById(id: string): Promise<Drug> {
    const drug = await this.drugModel.findById(id).exec();
    if (!drug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }
    return drug;
  }

  async update(id: string, updateDrugDto: UpdateDrugDto): Promise<Drug> {
    const updatedDrug = await this.drugModel
      .findByIdAndUpdate(id, updateDrugDto, { new: true })
      .exec();

    if (!updatedDrug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }

    return updatedDrug;
  }

  async remove(id: string): Promise<Drug> {
    const deletedDrug = await this.drugModel.findByIdAndDelete(id).exec();

    if (!deletedDrug) {
      throw new NotFoundException(`Drug with ID ${id} not found`);
    }

    return deletedDrug;
  }

  // Additional methods for specific queries
  async findByName(name: string): Promise<Drug[]> {
    return this.drugModel
      .find({
        name: { $regex: name, $options: 'i' },
      })
      .exec();
  }

  async findAvailableDrugs(): Promise<Drug[]> {
    return this.drugModel
      .find({
        isAvailable: true,
        amount: { $gt: 0 },
      })
      .exec();
  }
}
