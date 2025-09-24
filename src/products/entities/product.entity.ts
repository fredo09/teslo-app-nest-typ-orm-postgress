import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Product {
	@PrimaryColumn('uuid')
	id: string;

	@Column('text', {
		unique: true,
	})
	title: string;

	@Column('numeric', {
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
}
