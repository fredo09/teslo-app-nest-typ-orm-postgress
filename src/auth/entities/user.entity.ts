import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";

import { Product } from "src/products/entities";

/**
 * Entidad de usuario
 * Representa la tabla de usuarios en la base de datos
 * Define las columnas y sus propiedades
 * Incluye relaciones con otras entidades (productos)
 * Maneja eventos antes de insertar o actualizar registros
 * @author Alfredo Vázquez
 * @version 1.0.0
 */
@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', {
		unique: true,
	})
	email: string;

	@Column('text', {
		select: false, //* -> para que no se devuelva el password en las consultas normales
	})
	password: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	fullName: string;

	@Column('bool', {
		default: true,
	})
	isActive: boolean;

	@Column("text", {
		array: true,
		default: ['user'], //* -> por defecto todos los usuarios son 'user' (rol basico)
	})
	roles: string[];

	//* Relacion de usuario a productos (un usuario puede tener muchos productos)
	@OneToMany(
		() => Product, //! -> entidad relacionada
		(product) => product.user, //! -> propiedad de la entidad "Product" a la que se relaciona
	)
	product: Product[];

	@BeforeInsert()
	checkFieldsBeforeInsert() {
		this.email = this.email.toLowerCase().trim();
	}

	@BeforeUpdate()
	checkFieldsBeforeUpdate() {
		this.checkFieldsBeforeInsert();
	}
}
