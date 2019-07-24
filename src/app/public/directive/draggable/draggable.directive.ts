import { Directive, Input, Output, ElementRef, NgZone } from "@angular/core";

import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { fromEvent, Subscription, BehaviorSubject, Subject } from "rxjs";

@Directive({
    selector: `[nrDraggable],[nrIdBody]`,
})
export class DraggableDirective {
    private listenDown$: Subscription;
    private listenMove$: Subscription;
    private listenUp$: Subscription;

    private _nrIdBody: string = "#main";
    private _nrIsStopPropagation: boolean = true;

    // 发射增量数据
    @Output()
    public launchMouseIncrement: Subject<DraggablePort> = new Subject<DraggablePort>();

    // 发射鼠标按下之后的MouseEvent
    @Output()
    public launchMouseEvent: Subject<MouseEvent> = new Subject();

    // 传入的拖拽区域的主体，只能是id选择器
    @Input()
    public set nrIdBody(v: string) {
        setTimeout(() => {
            if (v != "" && document.querySelector(v)) {
                this._nrIdBody = v;
            } else {
                this._nrIdBody = "#main";
            }
        });
    }
    public get nrIdBody(): string {
        return this._nrIdBody;
    }

    // 是否取消冒泡事件
    @Input()
    public set nrIsStopPropagation(v: boolean) {
        this._nrIsStopPropagation = v;
    }
    public get nrIsStopPropagation(): boolean {
        return this._nrIsStopPropagation;
    }

    constructor(private el: ElementRef, private zone: NgZone) {
        // 开启鼠标按下监听
        if (this.listenDown$) this.listenDown$.unsubscribe();
        this.listenDown$ = fromEvent(this.el.nativeElement, "mousedown").subscribe((event: MouseEvent) => {
            this.zone.run(() => {
                this.listenMouseDownMove(event);
            });
        });
    }

    ngOnDestroy() {
        if (this.listenDown$) this.listenDown$.unsubscribe();
        if (this.listenMove$) this.listenMove$.unsubscribe();
        if (this.listenUp$) this.listenUp$.unsubscribe();
    }

    /**
     * 获取可拖拽区域的elemnt
     */
    public getHostElement(): Element {
        return document.querySelector(this.nrIdBody);
    }

    /**
     * 监听宿主的拖拽事件
     */
    public listenMouseDownMove(event: MouseEvent): void {
        // 清空之前的默认鼠标位置
        this.launchMouseIncrement.next(null);
        // 清空之前的鼠标移动事件
        if (this.listenMove$) this.listenMove$.unsubscribe();
        if (this.nrIsStopPropagation == true) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }
        // 鼠标按下之后监听全局的鼠标移动事件
        this.listenMove$ = fromEvent(this.getHostElement(), "mousemove").subscribe((move: MouseEvent) => {
            this.zone.run(() => {
                this.launchMouseEvent.next(move);
                this.launchMouseIncrement.next({ top: move.movementY, left: move.movementX });
            });
        });

        // 释放双手，取消所有的监听事件
        this.listenUp$ = fromEvent(document, "mouseup").subscribe(() => {
            this.launchMouseIncrement.next(null);
            if (this.listenMove$) this.listenMove$.unsubscribe();
            if (this.listenUp$) this.listenUp$.unsubscribe();
        });
    }
}
