import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() page: number) {
    return this.productService.findAll({ page })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id)
  }
}
