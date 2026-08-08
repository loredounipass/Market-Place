import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';



// MARCA UNA RUTA COMO PÚBLICA
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
