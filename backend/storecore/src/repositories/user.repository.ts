import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}



  // OBTIENE EL MODELO
  get model() {
    return this.userModel;
  }



  // BUSCA UN USUARIO POR FILTRO
  findOne(filter: any) {
    return this.userModel.findOne(filter).exec();
  }



  // BUSCA UN USUARIO POR ID
  findById(id: string) {
    return this.userModel.findById(id).exec();
  }



  // CREA UN NUEVO USUARIO
  create(createUserData: any) {
    return this.userModel.create(createUserData);
  }



  // BUSCA Y ACTUALIZA UN USUARIO POR FILTRO
  findOneAndUpdate(filter: any, update: any, options?: any) {
    return this.userModel.findOneAndUpdate(filter, update, options).exec();
  }



  // BUSCA Y ACTUALIZA UN USUARIO POR ID
  findByIdAndUpdate(id: string, update: any, options?: any) {
    return this.userModel.findByIdAndUpdate(id, update, options).exec();
  }



  // BUSCA USUARIOS POR FILTRO
  find(filter: any) {
    return this.userModel.find(filter);
  }
}

export default UserRepository;
