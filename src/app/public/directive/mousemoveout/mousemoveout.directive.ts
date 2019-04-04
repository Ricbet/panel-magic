import { Directive, Output, EventEmitter } from "@angular/core";

export type TYPE = "enter" | "out" | string;

// 监听鼠标的移入和移出并返回对应的type
@Directive({
	selector: "[nrMouseMoveOut]",
	host: {
		"(mouseenter)": "listenMouse('enter')",
		"(mouseleave)": "listenMouse('out')"
	}
})
export class MousemoveoutDirective {
	@Output()
	public emitMouseType: EventEmitter<TYPE> = new EventEmitter<TYPE>();

	constructor() {}

	public listenMouse(type: TYPE): void {
		this.emitMouseType.emit(type);
	}
}
