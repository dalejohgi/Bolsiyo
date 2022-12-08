import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Product, dataSource);
  }

  async getAllActiveProducts(companyId: number): Promise<Product[]> {
    const items = await this.execute(
      '\
      SELECT p.* \
      FROM products p \
      INNER JOIN categories ca \
        ON p.categoryId = ca.id \
      INNER JOIN companies co \
        ON p.companyId = co.id\
      WHERE ca.isActive = 1\
      AND p.deletedAt IS NULL\
      AND co.id = ?',
      [companyId],
    );

    return items.map((item: Object) => new Product(item));
  }

  async getProductsWithCompanies(productId: number): Promise<any> {
    const item = await this.execute(
      '\
      SELECT p.*, co.name AS companyName, co.address AS companyAddress \
      FROM products p\
      INNER JOIN companies co ON p.companyId = co.id\
      WHERE p.id = ?\
      AND p.deletedAt IS NULL\
    ',
      [productId],
    );

    return item[0];
  }

  async createNewProduct(
    productToCreate: Omit<Product, 'id'>,
  ): Promise<Product> {
    const {
      code,
      name,
      description,
      brand,
      categoryId,
      quantity,
      price,
      companyId,
    } = productToCreate;

    const createdItem = await this.execute(`
      INSERT INTO products (
        code, name, description, brand, categoryId, quantity, price, companyId
        )
      VALUES (
        '${code}', '${name}', '${description}', '${brand}', ${categoryId}, ${quantity}, ${price}, ${companyId}
      )
    `);

    return new Product(createdItem);
  }
  //Pending
  async updateProductById(id: number, productUpdates: Product): Promise<any> {
    let setString = '';
    for (const [key, value] of Object.entries(productUpdates)) {
      let stringToAppend = '';
      if (key in ['categoryId', 'quantity', 'price']) {
        stringToAppend = `${key} = ${value},`;
      } else {
        stringToAppend = `${key} = '${value}',`;
      }
      setString = setString + stringToAppend;
    }
    setString = setString.slice(0, -1);
    const query = `UPDATE products SET ${setString} WHERE id = ${id}`;

    return this.execute(query);
  }

  async deleteProductById(id: number): Promise<any> {
    return this.execute(
      'UPDATE products SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
    );
  }
}
