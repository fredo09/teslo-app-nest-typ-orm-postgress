//! Cada entity es una tabla en la bd
import { 
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

/**
 * Entidad de producto
 * Define la estructura de la tabla de productos en la base de datos
 * Incluye columnas para id, título, precio, descripción, slug, stock, tallas y género
 * Utiliza decoradores de TypeORM para mapear las propiedades a columnas de la tabla
 * Incorpora validaciones y transformaciones antes de insertar o actualizar registros
 * @author fredy_vazzqz
 * @version 1.0.0
 */

 // * nombre de la tabla en la bd
@Entity({ name: 'products' })
export class Product {
	@ApiProperty()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty()
	@Column('text', {
		unique: true,
	})
	title: string;

	@ApiProperty()
	@Column('float', {
		default: 0
	})
	price: number;

	@ApiProperty()
	@Column({
		type: 'text',
		nullable: true,
	})
	description: string;

	@ApiProperty()
	@Column('text', {
		unique: true,
	})
	slug: string;

	@ApiProperty()
	@Column('int', {
		default: 0
	})
	stock: number;

	@ApiProperty()
	@Column('text', {
		array: true
	})
	sizes: string[];

	@ApiProperty()
	@Column('text')
	gender: string;

	//TODO: TAGS Y IMAGES
	@ApiProperty()
	@Column('text', {
		array: true,
		default: []
	})
	tags: string[];

	//! relacion de images con product
	@ApiProperty()
	@OneToMany(
		() => ProductImage,
		(productImage) => productImage.product,
		{ cascade: true, eager: true } // * cascade: true -> si se elimina un producto, se eliminan sus imagenes, ademas el 'eager: true' carga las imagenes automaticamente cuando se carga el producto 'relaciones de tablas'
	)
	images? : ProductImage[];

	//! -> relacion de muchos productos a un usuario
	@ManyToOne(
		() => User, //! -> entidad a la que se  relacionara
		(User) => User.product, //! -> aqui sabra con que campo se relaciona (la propiedad product en la entidad User
		{ eager: true } //! -> para que al traer un producto, traiga tambien el usuario que lo creo
	)
	user: User;

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
