import { CategorySchema } from '../src/common/schemas/category.schema'
import { AttributeSchema } from '../src/common/schemas/attribute.schema'
import { model } from 'mongoose'

const categoryModel = model('Category', CategorySchema)
const attributeModel = model('Attribute', AttributeSchema)

export async function insert() {
  const clothingCategory = await categoryModel.findOne({ path: 'clothing' })
  const mensClothingCategory = await categoryModel.findOne({
    path: 'clothing>mens-clothing',
  })
  const mensTShirtsCategory = await categoryModel.findOne({
    path: 'clothing>mens-clothing>mens-t-shirts',
  })

  if (!clothingCategory || !mensClothingCategory || !mensTShirtsCategory) {
    console.log('One or more categories not found.')
    return
  }

  const attributesData = [
    {
      name: 'size',
      label: 'Size',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      categoryPaths: ['clothing'],
      type: 'size',
    },
    {
      name: 'color',
      label: 'Color',
      values: ['Black', 'White', 'Gray', 'Blue', 'Red', 'Green'],
      categoryPaths: ['clothing'],
      type: 'color',
    },
    {
      name: 'material',
      label: 'Material',
      values: ['Cotton', 'Polyester', 'Rayon', 'Spandex', 'Blend'],
      categoryPaths: ['clothing'],
      type: 'description',
    },
    {
      name: 'sleeve-length',
      label: 'Sleeve Length',
      values: ['Short Sleeve', 'Long Sleeve', 'Sleeveless'],
      categoryPaths: ['clothing/mens-clothing/mens-t-shirts'],
      type: 'description',
    },
    {
      name: 'brand',
      label: 'Brand',
      values: ['AmanAman', 'Nike', 'Adidas'],
      categoryPaths: ['clothing'],
      type: 'description',
    },
    {
      name: 'neck-type',
      label: 'Neck Type',
      values: ['Crew Neck', 'V-Neck', 'Henley', 'Polo'],
      categoryPaths: ['clothing/mens-clothing/mens-t-shirts'],
      type: 'description',
    },
    {
      name: 'pattern',
      label: 'Pattern',
      values: ['Solid', 'Striped', 'Printed', 'Graphic'],
      categoryPaths: ['clothing'],
      type: 'description',
    },
    {
      name: 'fit-type',
      label: 'Fit Type',
      values: ['Regular', 'Slim', 'Loose', 'Athletic'],
      categoryPaths: ['clothing/mens-clothing/mens-t-shirts'],
      type: 'description',
    },
  ]

  await attributeModel.deleteMany({})
  try {
    for (const attrData of attributesData) {
      await attributeModel.create(attrData)
    }
    console.log('Attributes linked to categories successfully.')
  } catch (error) {
    console.error('Error linking attributes to categories:', error)
  }
}
