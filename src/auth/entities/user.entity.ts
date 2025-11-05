import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', {
		unique: true,
	})
	email: string;

	@Column('text')
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
		default: ['user'], // * por defecto todos los usuarios son 'user' (rol basico)
	})
	roles: string[];


}
