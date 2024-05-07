import mongoose from 'mongoose'
import { insert as insertCategories } from './initCategories'
import { insert as insertAttributes } from './initAttributes'
import { insert as insertProducts } from './createTestProducts'
;(async function initializeData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/e-commerce')
    console.log('MongoDB connected')
    await insertCategories()
    console.log('before attr')
    await insertAttributes()
    console.log('before prod')
    await insertProducts()
  } catch (err) {
    console.error('MongoDB connection error:', err)
  } finally {
    await mongoose.connection.close()
  }
})()
