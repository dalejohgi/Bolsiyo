import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  @get('/categories')
  @response(200, {
    description: 'Get a list of categories',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Category[]> {
    return this.categoryRepository.getAllCategories();
  }

  @get('/categories/{id}')
  @response(200, {
    description: 'Get a category model instance by its id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async findCategoryById(
    @param.path.number('id') id: number,
    @param.filter(Category, {exclude: 'where'})
    filter?: FilterExcludingWhere<Category>,
  ): Promise<Category> {
    return this.categoryRepository.findCategoryById(id);
  }

  @post('/categories')
  @response(200, {
    description: 'Create a new category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    categoryToCreate: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.categoryRepository.createNewCategory(categoryToCreate);
  }

  @patch('/categories/{id}')
  @response(200, {
    description: 'Category PATCH success',
  })
  async findAndUpdateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    categoryUpdates: Category,
  ): Promise<any> {
    const foundCategory = this.categoryRepository.findCategoryById(id);
    if (!foundCategory) {
      return;
    }
    const updatedCategory = await this.categoryRepository.updateCategoryById(
      id,
      categoryUpdates,
    );
    return updatedCategory;
  }

  @get('/categories/activate/{id}')
  @response(200, {
    description: 'Activate category',
  })
  async findAndActivateById(@param.path.number('id') id: number): Promise<any> {
    const foundCategory = this.categoryRepository.findCategoryById(id);
    if (!foundCategory) {
      return;
    }
    return this.categoryRepository.activateCategory(id);
  }

  @get('/categories/inactivate/{id}')
  @response(200, {
    description: 'Inctivate category',
  })
  async findAndInactivateById(
    @param.path.number('id') id: number,
  ): Promise<any> {
    const foundCategory = this.categoryRepository.findCategoryById(id);
    if (!foundCategory) {
      return;
    }
    return this.categoryRepository.inactivateCategory(id);
  }
}
