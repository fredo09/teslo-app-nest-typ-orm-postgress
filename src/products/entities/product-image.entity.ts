import { Column, Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Product } from "./product.entity";

/**
 * ProductImage entity representing an image associated with a product.	
 * This class can be expanded with properties such as URL, alt text, and metadata as needed.
 * @entity
 * @table product_images
 * @author alfredo_vazquez
 * @date 2024-06-10
 * @version 1.0.0
 */

@Entity()
export class ProductImage {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	url: string;

	@ManyToOne(
		() => Product,
		(product) => product.images,
	)
	product: Product
}