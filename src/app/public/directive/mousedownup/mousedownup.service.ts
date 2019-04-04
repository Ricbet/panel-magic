import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class MousedownupService {
	public listenMouseDown$: () => any;
	public listenMouseUp$: () => any;

	constructor() {}
}
