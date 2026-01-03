/**
 * Decorator to extract the user from the request object.
 * @author Alfredo Vázquez
 * @version 1.0.0
 */

import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException
} from "@nestjs/common";

export const GetUserDecorator = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		if (!user) 
			throw new InternalServerErrorException('User not found (request)');

		return !data ? user : user[data];
	}
);
