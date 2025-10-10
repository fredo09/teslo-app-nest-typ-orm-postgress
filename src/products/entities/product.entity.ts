//! Cada entity es una tabla en la bd
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

/**
 * Entidad de producto
 * Define la estructura de la tabla de productos en la base de datos
 * Incluye columnas para id, título, precio, descripción, slug, stock, tallas y género
 * Utiliza decoradores de TypeORM para mapear las propiedades a columnas de la tabla
 * Incorpora validaciones y transformaciones antes de insertar o actualizar registros
 * @author fredy_vazzqz
 * @version 1.0.0
 */
@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', {
		unique: true,
	})
	title: string;

	@Column('float', {
		default: 0
	})
	price: number;

	@Column({
		type: 'text',
		nullable: true,
	})
	description: string;

	@Column('text', {
		unique: true,
	})
	slug: string;

	@Column('int', {
		default: 0
	})
	stock: number;

	@Column('text', {
		array: true
	})
	sizes: string[];

	@Column('text')
	gender: string;

	//TODO: TAGS Y IMAGES
	@Column('text', {
		array: true,
		default: []
	})
	tags: string[];

	//! relacion de images con product
	@OneToMany(
		() => ProductImage,
		(productImage) => productImage.product,
		{ cascade: true } //cascade: true -> si se elimina un producto, se eliminan sus imagenes
	)
	images? : ProductImage;

	//* Usamos el before Insert y BeforeUpdate para hacer algo antes de insertar o actualizar
	@BeforeInsert()
	checkSlugInsert() {
		if(!this.slug) this.slug = this.title;

		this.slug = this.slug
		.toLowerCase()
		.replaceAll(' ', '-')
		.replaceAll("'", '');
	}

	@BeforeUpdate()
	checkSlugUpdate() {		
		this.slug = this.slug
		.toLowerCase()
		.replaceAll(' ', '-')
		.replaceAll("'", '');
	}
}
