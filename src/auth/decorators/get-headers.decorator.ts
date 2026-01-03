
/**
 * Custom decorator to get raw headers from the request
 * @author Alfredo Vázquez
 * @version 1.0.0
 */

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetRawHeadersDecorator = createParamDecorator(
	(data, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request.rawHeaders;
	}
);