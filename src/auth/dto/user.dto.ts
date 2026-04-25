import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

/**
 * Data Transfer Object para la creación de un nuevo usuario.
 * Incluye validaciones para los campos email, password y fullname.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */

export class CreateUserDto {
	@ApiProperty({
		description: 'Correo electrónico del usuario',
		example: 'user@example.com',
		nullable: false,
	})
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'Contraseña del usuario',
		example: 'Password123',
		nullable: false,
	})
	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	})
	password: string;

	@ApiProperty({
		description: 'Nombre completo del usuario',
		example: 'John Doe',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	fullName?: string;
}