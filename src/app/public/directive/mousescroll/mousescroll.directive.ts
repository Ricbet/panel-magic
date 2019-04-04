import { Directive, Renderer2, ElementRef, NgZone, EventEmitter, Output } from "@angular/core";

import { MousescrollService } from "./mousescroll.service";
import { IMouseDelta } from "./mousescroll.interface";

@Directive({
	selector: `[nrMouseScroll]`
})
export class MousescrollDirective {
	@Output()
	public launchMouseScroll: EventEmitter<IMouseDelta> = new EventEmitter<IMouseDelta>();

	constructor(
		private renderer: Renderer2,
		private zone: NgZone,
		private ms: MousescrollService,
		private el: ElementRef
	) {
		this.listenMouseScroll();
	}

	/**
	 * 开启鼠标滚动监听
	 */
	public listenMouseScroll(): void {
		if (this.ms.listenMouseScroll$) this.ms.listenMouseScroll$();
		// 取消浏览器的鼠标回退和前进操作事件
		this.ms.listenMouseScroll$ = this.renderer.listen(this.el.nativeElement, "mousewheel", (_mouse: WheelEvent) => {
			this.zone.run(() => {
				// _mouse.stopPropagation();
				// _mouse.stopImmediatePropagation();
				_mouse.preventDefault();
				const _x = _mouse.deltaX;
				const _y = _mouse.deltaY;
				this.launchMouseScroll.next({
					deltaX: _x,
					deltaY: _y
				});
			});
		});
	}
}
