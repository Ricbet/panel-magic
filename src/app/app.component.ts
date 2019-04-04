import { Component } from "@angular/core";
import { AppService } from "./app.service";
import { SafeResourceUrl } from "@angular/platform-browser";

@Component({
	selector: "app-root",
	template: `
		<link rel="stylesheet" type="text/css" [href]="iconUrl" />
		<router-outlet></router-outlet>
	`,
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {
	public iconUrl: SafeResourceUrl = "";
	constructor(private readonly appService: AppService) {
		this.iconUrl = this.appService.iconUrls;
	}
}
