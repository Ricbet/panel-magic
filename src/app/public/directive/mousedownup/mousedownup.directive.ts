import { Directive, EventEmitter, Output, Renderer2, ElementRef, NgZone } from "@angular/core";

import { MousedownupService } from "./mousedownup.service";

/**
 * 监听全局的鼠标按下和松开事件
 */
@Directive({
	selector: "[nrMouseDownUp]"
})
export class MousedownupDirective {
	@Output()
	public launchMouseDownUp: EventEmitter<"Down" | "Up"> = new EventEmitter();

	constructor(private ms: MousedownupService, private zone: NgZone, private renderer: Renderer2) {
		this.listenSpacebarKey();
	}

	/**
	 * 开启监听
	 */
	public listenSpacebarKey(): void {
		if (this.ms.listenMouseDown$) this.ms.listenMouseDown$();
		if (this.ms.listenMouseUp$) this.ms.listenMouseUp$();
		this.ms.listenMouseDown$ = this.renderer.listen(document, "mousedown", (res: MouseEvent) => {
			this.zone.run(() => {
				this.launchMouseDownUp.next("Down");
			});
		});
		this.ms.listenMouseUp$ = this.renderer.listen(document, "mouseup", (res: MouseEvent) => {
			this.zone.run(() => {
				this.launchMouseDownUp.next("Up");
			});
		});
	}
}
