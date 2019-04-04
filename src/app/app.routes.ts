import { HomeComponent } from "./app-home.component";

import { HsXcxCanActivate } from "./service/hs-xcx/hs-xcx.activate.service";

export const AppRoutes = [
	{
		path: ":id",
		data: { type: "normal" },
		canActivate: [HsXcxCanActivate],
		component: HomeComponent
	},
	{
		path: "",
		data: { type: "normal" },
		canActivate: [HsXcxCanActivate],
		redirectTo: "mock",
		pathMatch: "full"
	},
	{
		path: "**",
		redirectTo: "mock",
		pathMatch: "full"
	}
];
