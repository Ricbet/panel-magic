import { NgModule, Optional, SkipSelf, APP_INITIALIZER, Injector } from "@angular/core";
import { CookieModule } from "ngx-cookie";

import { interceptors } from "./http-seal/interceptor";
import { AppInitAuthService } from "./app-init";

/**
 * 防止多次引入 coreModule
 */
function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(`请避免多次引入 coreModule`);
	}
}

/**
 * core 模块一般放一些只需引入一次的服务比如 http 拦截器、全局单例服务等等
 * 但是由于 angular6 中单例服务可以直接在服务中声明 root，所以可以不用在此模版引用声明
 */
@NgModule({
	imports: [CookieModule.forRoot()],
	providers: [
		interceptors,
		{
			provide: APP_INITIALIZER,
			multi: true,
			useFactory: (appInit: AppInitAuthService, injector: Injector) => {
				return () => appInit.tokenAuth();
			},
			deps: [AppInitAuthService]
		}
	]
})
export class CoreModule {
	constructor(
		@Optional()
		@SkipSelf()
		parentModule: CoreModule
	) {
		throwIfAlreadyLoaded(parentModule, "CoreModule");
	}
}
