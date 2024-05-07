import { CategorySchema } from '../src/common/schemas/category.schema'
import { model } from 'mongoose'

const categoryModel = model('Category', CategorySchema)

export async function insert() {
  try {
    await categoryModel.deleteMany({})

    const clothing = await categoryModel.create({
      label: 'Clothing',
      labelForSeller: 'Clothing',
      path: 'clothing',
    })
    const mensClothing = await categoryModel.create({
      label: "Men's Clothing",
      labelForSeller: "Men's Clothing",
      parentCategoryId: clothing._id,
      path: 'clothing>mens-clothing',
    })
    await categoryModel.create({
      label: 'T-Shirts',
      labelForSeller: 'T-Shirts',
      parentCategoryId: mensClothing._id,
      path: 'clothing>mens-clothing>mens-t-shirts',
    })
    console.log('Categories inserted successfully')
  } catch (error) {
    console.error('Error inserting categories:', error)
  }
}
