import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Category} from '../models';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Category, dataSource);
  }
  async getAllCategories(): Promise<Category[]> {
    const rawItems = await this.execute('SELECT * FROM categories');
    return rawItems.map((item:Object) => new Category(item));
  }

  async findCategoryById(id: number): Promise<Category> {
    const item = await this
    .execute('\
      SELECT * \
      FROM categories\
      WHERE id = ?\
    ',[id]);
    return new Category(item[0])
  }

  async createNewCategory(categoryToCreate: Omit<Category, 'id'>): Promise<Category> {
    const {
      code, 
      name, 
      description, 
      isActive
    } = categoryToCreate;

    const foundItem = await this
    .execute(`
      INSERT INTO categories (
        code, categoryName, description, isActive
        )
      VALUES (
        '${code}', '${name}', '${description}', ${isActive}
      )
    `);
  
    return new Category(foundItem)
  }
  //Pending
  async updateCategoryById(id: number, categoryUpdates: Category): Promise<any> {
    let setString: string = "";
    for (const [key, value]  of Object.entries(categoryUpdates)) {
      let stringToAppend = "";
      if (key === 'isActive') {
        stringToAppend =  `${key} = ${value},`
      } else {
        stringToAppend =  `${key} = '${value}',`
      }
      setString = setString + stringToAppend;
    }
    setString = setString.slice(0, -1);
    const query = `UPDATE categories SET ${setString} WHERE id = ${id}`

    return await this.execute(query)
  }

  async activateCategory(id: number): Promise<any> {
    return await this.execute('UPDATE categories SET isActive = true WHERE id = ?', [id]);
  }

  async inactivateCategory(id: number): Promise<any> {
    return await this.execute('UPDATE categories SET isActive = false WHERE id = ?', [id]);
  }
} 
