import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create.product.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async validateUser(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }

  private convertPhotoToBase64(photo: Buffer | string): string {
    if (Buffer.isBuffer(photo)) {
      return photo.toString('base64');
    } else if (typeof photo === 'string') {
      return photo;
    }
    throw new InternalServerErrorException('Formato de imagen no válido. La imagen debe ser un Buffer o una cadena en base64.');
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const user = await this.validateUser(createProductDto.email);
      const base64Image = this.convertPhotoToBase64(createProductDto.photo);

      const product = new this.productModel({
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        photo: base64Image,
        user: user._id,
        category: createProductDto.category, 
      });
      await product.save();
      user.products = user.products || [];
      user.products.push(product._id);
      await user.save();
      return product;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException('Error al crear el producto: ' + message);
    }
  }

  async getAllProducts(): Promise<any[]> {
    try {
      const products = await this.productModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            name: 1,
            photo: 1,
            price: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            category: 1, 
          },
        },
      ]);
      if (!products || products.length === 0) {
        return [{ message: 'Aún no hay productos.' }];
      }
      const productData = products.map((product) => ({
        name: product.name,
        photo: `data:image/jpeg;base64,${product.photo}`,
        price: product.price,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: product.category, 
      }));
      return productData;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException('Error al obtener los productos: ' + message);
    }
  }
}