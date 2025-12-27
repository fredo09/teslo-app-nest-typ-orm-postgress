import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

	@BeforeInsert()
	checkFieldsBeforeInsert() {
		this.email = this.email.toLowerCase().trim();
	}

	@BeforeUpdate()
	checkFieldsBeforeUpdate() {
		this.checkFieldsBeforeInsert();
	}
}
