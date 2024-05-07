import { CategorySchema } from '../src/common/schemas/category.schema'
import { AttributeSchema } from '../src/common/schemas/attribute.schema'
import { ProductSchema } from '../src/product/schemas/product.schema'
import { model } from 'mongoose'

const categoryModel = model('Category', CategorySchema)
const attributeModel = model('Attribute', AttributeSchema)
const productModel = model('Product', ProductSchema)

export async function insert() {
  const category = await categoryModel.findOne({
    path: 'clothing>mens-clothing>mens-t-shirts',
  })
  if (!category) {
    console.log('Category not found.')
    return
  }

  const sizeAttribute = await attributeModel.findOne({ name: 'size' })
  const colorAttribute = await attributeModel.findOne({ name: 'color' })

  if (!sizeAttribute || !colorAttribute) {
    console.log('Attributes not found.')
    return
  }
  await productModel.deleteMany({})
  console.log('Old Test products are deleted')

  const testProduct = await productModel.create({
    name: 'Test Product',
    description: 'This is a test product description.',
    brand: 'AmanAman',
    price: 99.99,
    sku: 'TESTSKU123',
    dimensions: { weight: 1, length: 10, width: 10, height: 5 },
    variants: [
      {
        variantAttributes: [
          {
            attributeId: sizeAttribute._id,
            name: sizeAttribute.name,
            label: sizeAttribute.label,
            value: 'L',
          },
          {
            attributeId: colorAttribute._id,
            name: colorAttribute.name,
            label: colorAttribute.label,
            value: 'Blue',
          },
        ],
        stockQuantity: 100,
        price: 99.99,
        pictures: ['/some.jpg'],
        status: 'Published',
      },
      {
        variantAttributes: [
          {
            attributeId: sizeAttribute._id,
            name: sizeAttribute.name,
            label: sizeAttribute.label,
            value: 'XL',
          },
          {
            attributeId: colorAttribute._id,
            name: colorAttribute.name,
            label: colorAttribute.label,
            value: 'Blue',
          },
        ],
        stockQuantity: 1,
        price: 39.99,
        pictures: ['/home.jpg', '/some.jpg'],
        status: 'Published',
      },
    ],
    categoryId: category._id,
    isVisible: true,
  })

  console.log('Test product created:', testProduct)
}
