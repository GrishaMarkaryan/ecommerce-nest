import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Product, ProductDocument } from './schemas/product.schema'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async findAll({ page }) {
    const limit = 1

    const filter = {
      // $and: [
      //     // Common attributes filtering (if applicable)
      //     { 'commonAttributes.name': 'material', 'commonAttributes.value': 'Cotton' },
      //     // Variant-specific attributes filtering
      //     {
      //         'variants.variantAttributes': {
      //             $elemMatch: {
      //                 name: 'size',
      //                 value: 'M',
      //             },
      //         },
      //     },
      // ],
    }

    const productsPromise = this.productModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ _id: -1 })

    const countPromise = this.productModel.countDocuments(filter)

    const extremePricesPromise = this.productModel.aggregate([
      { $match: filter },
      { $unwind: '$variants' },
      {
        $group: {
          _id: null,
          maxPrice: { $max: '$variants.price' },
          minPrice: { $min: '$variants.price' },
        },
      },
    ])

    // Adjust uniqueAttributesPromise to consider variantAttributes
    const uniqueAttributesPromise = this.productModel.aggregate([
      { $match: filter },
      { $unwind: '$variants' },
      { $unwind: '$variants.variantAttributes' },
      {
        $lookup: {
          from: 'attributes', // Ensure this matches your actual collection name
          localField: 'variants.variantAttributes.attributeId',
          foreignField: '_id',
          as: 'attributeDetails',
        },
      },
      { $unwind: '$attributeDetails' },
      {
        $group: {
          _id: {
            name: '$attributeDetails.name',
            value: '$variants.variantAttributes.value',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.name',
          values: { $addToSet: '$_id.value' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          values: 1,
        },
      },
    ])

    const [products, count, extremePrices, uniqueAttributes] =
      await Promise.all([
        productsPromise,
        countPromise,
        extremePricesPromise,
        uniqueAttributesPromise,
      ])

    return {
      products,
      totalPageCount: Math.ceil(count / limit),
      currentPage: +page,
      maxPrice: extremePrices[0]?.maxPrice,
      minPrice: extremePrices[0]?.minPrice,
      attributes: uniqueAttributes.map((attr) => ({
        name: attr.name,
        values: attr.values.sort(),
      })),
    }
  }

  async findOne(id: string) {
    const variantId = new mongoose.Types.ObjectId(id)
    const products = await this.productModel.aggregate([
      { $match: { 'variants._id': variantId } }, // Match the document containing the variant
      {
        $addFields: {
          variants: {
            $filter: {
              input: '$variants',
              as: 'variant',
              cond: { $eq: ['$$variant._id', variantId] },
            },
          },
        },
      },
    ])
    if (!products?.length) {
      throw new NotFoundException(
        'Cannot find product with the specified variant'
      )
    }
    console.log(products)
    return products[0]
  }
}
