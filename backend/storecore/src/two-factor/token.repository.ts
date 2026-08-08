import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './schemas/verification.schema';

@Injectable()
export class TokenRepository {
  constructor(@InjectModel('Token') private readonly tokenModel: Model<Token>) {}



  // BUSCA UN TOKEN POR FILTRO
  findOne(filter: any) {
    return this.tokenModel.findOne(filter).exec();
  }



  // BUSCA Y ACTUALIZA UN TOKEN POR FILTRO
  findOneAndUpdate(filter: any, update: any, options?: any) {
    return this.tokenModel.findOneAndUpdate(filter, update, options).exec();
  }



  // CREA UN NUEVO TOKEN
  create(data: any) {
    return this.tokenModel.create(data);
  }
}

export default TokenRepository;
