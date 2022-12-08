import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })

  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
    jsonSchema: {
      pattern: /([A-Z]|[a-z]|[0-9])/.source,
      minLength: 4,
      maxLength: 10,
    },
  })
  code: string;

  @property({
    required: true,
    jsonSchema: {
      minLength: 4,
      errorMessage: 'Name must bu at least 4 characters'
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @property({
    type: 'number',
    required: true,
  })
  categoryId: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 0,
    },
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  companyId: number;


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
