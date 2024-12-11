import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Prescription,
  PrescriptionStatus,
} from './schemas/prescription.schema';
import { User, UserType } from '../users/user.schema';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<Prescription>,
  ) {}

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    client: User,
  ): Promise<Prescription> {
    const prescriptionData = {
      ...createPrescriptionDto,
      client: client._id,
      status: PrescriptionStatus.OPEN,
    };

    const createdPrescription = new this.prescriptionModel(prescriptionData);
    return createdPrescription.save();
  }

  async findAll(
    user: User,
    status?: PrescriptionStatus,
  ): Promise<Prescription[]> {
    const query: any = {};

    // Clients can only see their own prescriptions
    // Pharmacists can see all prescriptions
    if (user.userType === UserType.CLIENT) {
      query.client = user._id;
    }

    // Optional status filter
    if (status) {
      query.status = status;
    }

    return this.prescriptionModel
      .find(query)
      .populate('client', 'name email')
      .populate('assignedPharmacist', 'name email')
      .populate('drugs.drug')
      .exec();
  }

  async findById(id: string, user: User): Promise<Prescription> {
    const prescription = await this.prescriptionModel
      .findById(id)
      .populate('client', 'name email')
      .populate('assignedPharmacist', 'name email')
      .populate('drugs.drug')
      .exec();

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Clients can only access their own prescriptions
    // Pharmacists can access all prescriptions
    if (
      user.userType === UserType.CLIENT &&
      prescription.client._id.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException('You cannot access this prescription');
    }

    return prescription;
  }

  async update(
    id: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
    user: User,
  ): Promise<Prescription> {
    // Find the existing prescription
    const prescription = await this.prescriptionModel.findById(id);

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Clients can only update their own open prescriptions
    // Pharmacists can update any prescription
    if (
      user.userType === UserType.CLIENT &&
      (prescription.client.toString() !== user._id.toString() ||
        prescription.status !== PrescriptionStatus.OPEN)
    ) {
      throw new ForbiddenException('You cannot update this prescription');
    }

    // If a pharmacist is updating, they can change the status
    if (user.userType === UserType.PHARAMIST && updatePrescriptionDto.status) {
      prescription.status = updatePrescriptionDto.status;
    }

    // Update other fields
    if (updatePrescriptionDto.drugs) {
      //   prescription.drugs = updatePrescriptionDto.drugs.map((drug) => {
      //     return {
      //       drug: drug.drug,
      //       quantity: drug.quantity,
      //     };
      //   });
    }
    if (updatePrescriptionDto.images) {
      prescription.images = updatePrescriptionDto.images;
    }
    if (updatePrescriptionDto.notes) {
      prescription.notes = updatePrescriptionDto.notes;
    }

    return prescription.save();
  }

  async remove(id: string, user: User): Promise<Prescription> {
    const prescription = await this.prescriptionModel.findById(id);

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Only clients can delete their own open prescriptions
    if (
      user.userType !== UserType.CLIENT ||
      prescription.client.toString() !== user._id.toString() ||
      prescription.status !== PrescriptionStatus.OPEN
    ) {
      throw new ForbiddenException('You cannot delete this prescription');
    }

    return this.prescriptionModel.findByIdAndDelete(id);
  }
}
