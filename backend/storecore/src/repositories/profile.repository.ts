import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileRepository {
  findOne(_filter: any) {
    return null;
  }

  findOneAndUpdate(_filter: any, _update: any, _options?: any) {
    return null;
  }

  find(_filter: any) {
    return null;
  }

  deleteOne(_filter: any) {
    return null;
  }

  deleteMany(_filter: any) {
    return null;
  }
}

export default ProfileRepository;
