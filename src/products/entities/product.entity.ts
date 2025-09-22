import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Product {
	@PrimaryColumn('uuid')
	id: string;

	@Column('text', {
		unique: true,
	})
	title: string;
}
