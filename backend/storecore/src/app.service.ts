import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {



  // OBTIENE EL MENSAJE DE BIENVENIDA
  getHello(): string {
    return 'Hello World!';
  }
}
