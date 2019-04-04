import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { TokenInterceptor } from "./token-interceptor";
import { TimeoutInterceptor } from "./timeout-interceptor";

export { TokenInterceptor } from "./token-interceptor";
export { TimeoutInterceptor } from "./timeout-interceptor";
export { ErrorHandlingInterceptor } from "./error-handling-interceptor";

export const interceptors = [
	// {
	//     provide: HTTP_INTERCEPTORS,
	//     useClass: ErrorHandlingInterceptor,
	//     multi: true
	// },
	{
		provide: HTTP_INTERCEPTORS,
		useClass: TokenInterceptor,
		multi: true
	},
	{
		provide: HTTP_INTERCEPTORS,
		useClass: TimeoutInterceptor,
		multi: true
	}
];
