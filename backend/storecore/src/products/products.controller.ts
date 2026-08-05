import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Request,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../products/products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { Product } from './schemas/product.schema';
import { AuthenticatedGuard } from 'src/guard/auth/authenticated.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    if (!file) {
      throw new BadRequestException('No se ha recibido ningún archivo en el campo "photo".');
    }
    createProductDto.photo = file.buffer;
    createProductDto.email = req.user.email; 
    return this.productService.createProduct(createProductDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  async findAll(@Request() req, @Query('q') q?: string): Promise<any[]> {
    return this.productService.getAllProducts(q);
  }
}