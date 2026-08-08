import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileRepository {



  // BUSCA UN PERFIL
  findOne(_filter: any) {
    return null;
  }



  // BUSCA Y ACTUALIZA UN PERFIL
  findOneAndUpdate(_filter: any, _update: any, _options?: any) {
    return null;
  }



  // BUSCA PERFILES
  find(_filter: any) {
    return null;
  }



  // ELIMINA UN PERFIL
  deleteOne(_filter: any) {
    return null;
  }



  // ELIMINA VARIOS PERFILES
  deleteMany(_filter: any) {
    return null;
  }
}

export default ProfileRepository;
