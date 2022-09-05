import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductCategory } from '../product-categories/product-category.entity';
import { CarProperties } from './types/car-properties.interface';
import { BookProperties } from './types/book-properties.interface';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products,
  )
  public category: ProductCategory;

  @Column({
    type: 'jsonb',
  })
  public properties: CarProperties | BookProperties;
}
