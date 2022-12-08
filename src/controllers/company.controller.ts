import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Company} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository : CompanyRepository,
  ) {}

  @post('/companies')
  @response(200, {
    description: 'Company model instance',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewCompany',
            exclude: ['id'],
          }),
        },
      },
    })
    company: Omit<Company, 'id'>,
  ): Promise<any> {
    return this.companyRepository.execute(`INSERT INTO companies (name, address) VALUES ('${company.name}', '${company.address}')`);
  }

  @get('/companies')
  @response(200, {
    description: 'Array of Company model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Company, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Company) filter?: Filter<Company>,
  ): Promise<any> {
    const companies = await this.companyRepository.execute('SELECT * FROM companies')
    return companies;
  }


  @get('/companies/{id}')
  @response(200, {
    description: 'Company model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Company, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    // AH??
    @param.filter(Company, {exclude: 'where'}) filter?: FilterExcludingWhere<Company>
  ): Promise<any> {
    return this.companyRepository.execute(`SELECT * FROM companies WHERE id = ${id}`);
  }
}
