import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from "@angular/core";
import { CanvasScaleplateModel, LineModel } from "./model";
import { PanelExtendService } from "../panel-extend.service";
import { PanelInfoModel, TransformMatrixModel } from "../model";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { PanelScaleplateService } from "./panel-scaleplate.service";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { debounceTime, tap } from "rxjs/operators";

@Component({
	selector: "app-panel-scaleplate",
	templateUrl: "./panel-scaleplate.component.html",
	styleUrls: ["./panel-scaleplate.component.scss"]
})
export class PanelScaleplateComponent implements OnInit, OnDestroy {
	// 最外层的容器宿主
	@ViewChild("mbRulerEl", { static: true })
	public mbRulerEl: ElementRef;
	@ViewChild("hCanvasEl", { static: true })
	public hCanvasEl: ElementRef;
	@ViewChild("vCanvasEl", { static: true })
	public vCanvasEl: ElementRef;
	// 检测窗口size变化的事件
	private windowSizeChange$: Subscription;
	// 监听鼠标移动事件
	private mouseMove$: Subscription;
	// 订阅视图移动变化的观察者
	private panelTransformMatricChangeRX$: Subscription;
	// 订阅通知回到原点的观察者
	private originBackRX$: Subscription;
	public get hRuler(): HTMLCanvasElement {
		return this.hCanvasEl.nativeElement;
	}
	public get vRuler(): HTMLCanvasElement {
		return this.vCanvasEl.nativeElement;
	}
	public get transformMatrixModel(): TransformMatrixModel {
		return this.panelExtendService.transformMatrixModel;
	}
	public get canvasScaleplateModel(): CanvasScaleplateModel {
		return this.panelScaleplateService.canvasScaleplateModel;
	}
	public get temporaryLine$(): BehaviorSubject<LineModel> {
		return this.canvasScaleplateModel.temporaryLine$;
	}
	public get hLineList$(): BehaviorSubject<Array<LineModel>> {
		return this.canvasScaleplateModel.hLineList$;
	}
	public get vLineList$(): BehaviorSubject<Array<LineModel>> {
		return this.canvasScaleplateModel.vLineList$;
	}
	public get isOpenMoveLine(): boolean {
		return this.panelScaleplateService.isOpenMoveLine$.value;
	}
	public get isShowLine(): boolean {
		return this.panelScaleplateService.isShowLine$.value;
	}
	// 主视图模型属性
	public get panelInfoModel(): PanelInfoModel {
		return this.panelExtendService.panelInfoModel;
	}
	constructor(
		private readonly panelExtendService: PanelExtendService,
		private readonly panelScaleplateService: PanelScaleplateService,
		private readonly zone: NgZone
	) {
		this.windowSizeChange$ = fromEvent(window, "resize")
			.pipe(
				tap(() => {
					this.panelExtendService.launchRecordPanelInfoRect$.next();
				})
			)
			.subscribe(() => {
				this.zone.run(() => {
					this.calcCanvasRulerSize();
					this.createHRulerRect();
					this.createVRulerRect();
					this.calcAllHVLineDrag();
				});
			});
		this.panelTransformMatricChangeRX$ = this.panelExtendService.transformMatrixModel.valueChange$
			.pipe(
				debounceTime(1),
				tap(() => {
					this.panelExtendService.launchRecordPanelInfoRect$.next();
				})
			)
			.subscribe(() => {
				this.createHRulerRect();
				this.createVRulerRect();
				// 如果有辅助线则根据面板偏移量移动
				this.calcAllHVLineDrag();
			});
		this.originBackRX$ = this.panelScaleplateService.launchOrigin$
			.pipe(
				tap(() => {
					this.transformMatrixModel.reset();
					this.panelExtendService.trackModel.reset();
				})
			)
			.subscribe(() => {
				this.panelExtendService.launchRecordPanelInfoRect$.next();
				this.calcCanvasRulerSize();
				this.createHRulerRect();
				this.createVRulerRect();
				this.calcAllHVLineDrag();
			});
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.panelInfoModel.recordImmobilizationData();
			this.createHRulerRect();
			this.createVRulerRect();
		});
	}

	ngOnInit() {
		this.calcCanvasRulerSize();
	}

	ngOnDestroy() {
		if (this.windowSizeChange$) this.windowSizeChange$.unsubscribe();
		if (this.panelTransformMatricChangeRX$) this.panelTransformMatricChangeRX$.unsubscribe();
		if (this.mouseMove$) this.mouseMove$.unsubscribe();
		if (this.originBackRX$) this.originBackRX$.unsubscribe();
	}

	/**
	 * 初始化标尺的宽度和高度，同时根据窗口大小的改变重新计算
	 */
	public calcCanvasRulerSize(): void {
		if (this.mbRulerEl && this.mbRulerEl.nativeElement) {
			const _rect = this.mbRulerEl.nativeElement.getBoundingClientRect();
			this.canvasScaleplateModel.width = _rect.width - 16;
			this.canvasScaleplateModel.height = _rect.height - 16;
		}
	}

	/**
	 * 绘制线条
	 */
	public drawLine(
		rule: CanvasRenderingContext2D,
		move: { moveStart: number; moveEnd: number },
		line: { lineStart: number; lineEnd: number },
		color: string
	): void {
		rule.beginPath();
		rule.strokeStyle = color;
		rule.moveTo(move.moveStart, move.moveEnd);
		rule.lineTo(line.lineStart, line.lineEnd);
		rule.stroke();
	}

	/**
	 * 创建横向的标尺
	 */
	public createHRulerRect(): void {
		const _h = this.hRuler.getContext("2d");
		const _panel_left_calc = this.panelInfoModel.left - 216;
		this.hRuler.width = this.canvasScaleplateModel.width;
		_h.transform(1, 0, 0, 1, this.transformMatrixModel.translateX, 0);
		_h.fillStyle = "#f9fafb";
		_h.fillRect(-this.transformMatrixModel.translateX, 0, this.canvasScaleplateModel.width, 16);
		// 创建新的矩阵
		_h.setTransform(1, 0, 0, 1, _panel_left_calc, 0);
		_h.lineWidth = 2;
		const _handle_draw_line = (i: number) => {
			this.drawLine(
				_h,
				{ moveStart: i * 10, moveEnd: i % 10 == 0 ? 0 : 10 },
				{ lineStart: i * 10, lineEnd: 16 },
				"#ccc"
			);
			this.drawLine(
				_h,
				{ moveStart: i * 10 + 1, moveEnd: i % 10 == 0 ? 0 : 10 },
				{ lineStart: i * 10 + 1, lineEnd: 16 },
				"#f9fafb"
			);
			if (i % 10 == 0) {
				_h.font = "normal normal bold 12px";
				_h.fillStyle = "#2b3c4d";
				_h.fillText(i * 10 + "", i * 10 + 4, 10);
			}
		};
		for (let i: number = 0; i < (this.canvasScaleplateModel.width - _panel_left_calc) / 10; i++) {
			_handle_draw_line(i);
		}
		for (let i: number = 0; i > -_panel_left_calc / 10; i--) {
			_handle_draw_line(i);
		}
	}

	/**
	 * 创建纵向的标尺
	 */
	public createVRulerRect(): void {
		const _v = this.vRuler.getContext("2d");
		const _text_v = this.vRuler.getContext("2d");
		const _panel_top_calc = this.panelInfoModel.top - 66;
		this.vRuler.height = this.canvasScaleplateModel.height;
		_v.transform(1, 0, 0, 1, 0, this.transformMatrixModel.translateY);
		_v.fillStyle = "#f9fafb";
		_v.fillRect(0, -this.transformMatrixModel.translateY, 16, this.canvasScaleplateModel.height);
		// 创建新的矩阵
		_v.setTransform(1, 0, 0, 1, 0, _panel_top_calc);
		_v.lineWidth = 2;
		const _handle_draw_line = (i: number) => {
			this.drawLine(
				_v,
				{ moveStart: i % 10 == 0 ? 0 : 10, moveEnd: i * 10 },
				{ lineStart: 16, lineEnd: i * 10 },
				"#ccc"
			);
			this.drawLine(
				_v,
				{ moveStart: i % 10 == 0 ? 0 : 10, moveEnd: i * 10 - 1 },
				{ lineStart: 16, lineEnd: i * 10 - 1 },
				"#f9fafb"
			);
			if (i % 10 == 0) {
				_text_v.save();
				_text_v.textAlign = "center";
				_text_v.textBaseline = "middle";
				_text_v.translate(6, i * 10 - 14);
				_text_v.rotate((-90 * Math.PI) / 180);
				_text_v.font = "normal normal bold 12px";
				_text_v.fillStyle = "#2b3c4d";
				_text_v.fillText(i * 10 + "", 0, 0);
				_text_v.restore();
			}
		};
		for (let i: number = 0; i < (this.canvasScaleplateModel.height - _panel_top_calc) / 10; i++) {
			_handle_draw_line(i);
		}
		for (let i: number = 0; i > -_panel_top_calc / 10; i--) {
			_handle_draw_line(i);
		}
	}

	/**
	 * 接受canvas面板鼠标移入
	 */
	public acceptCanvasMouseEnter(type: "h" | "v"): void {
		if (this.mouseMove$) this.mouseMove$.unsubscribe();
		const _tem_line = new LineModel(type);
		this.mouseMove$ = fromEvent(type == "h" ? this.hRuler : this.vRuler, "mousemove").subscribe(
			(move: MouseEvent) => {
				this.zone.run(() => {
					if (type == "h") {
						_tem_line.setInCanvasNum(move.pageX - 216 - (this.panelInfoModel.left - 216));
						_tem_line.setInPanelNum(move.pageX - 216);
					} else if (type == "v") {
						_tem_line.setInCanvasNum(move.pageY - 66 - (this.panelInfoModel.top - 66));
						_tem_line.setInPanelNum(move.pageY - 66);
					}
					this.canvasScaleplateModel.temporaryLine$.next(_tem_line);
				});
			}
		);
	}

	/**
	 * 接受canvas面板鼠移出
	 */
	public acceptCanvasMouseOut(): void {
		if (this.mouseMove$) this.mouseMove$.unsubscribe();
		this.temporaryLine$.next(null);
	}

	/**
	 * 创建辅助线
	 */
	public createLineList(type: "h" | "v"): void {
		const _tem_panel_num = this.temporaryLine$.value;
		const _line = new LineModel(type);
		_line.setInPanelNum(_tem_panel_num.inPanelNum);
		_line.setInCanvasNum(_tem_panel_num.inCanvasNum);
		this.panelScaleplateService[type == "h" ? "addHLine" : "addVLine"](_line);
		this.panelScaleplateService.isShowLine$.next(true);
	}

	/**
	 * 计算面板移动带来的偏移量而改变所有绘制的辅助线
	 */
	public calcAllHVLineDrag(): void {
		const _v_line = this.vLineList$.value;
		const _h_line = this.hLineList$.value;
		if (Array.isArray(_v_line)) {
			_v_line.forEach(_v => {
				_v.setInPanelNum(_v.inCanvasNum + this.panelInfoModel.top - 66);
			});
		}
		if (Array.isArray(_h_line)) {
			_h_line.forEach(_h => {
				_h.setInPanelNum(_h.inCanvasNum + this.panelInfoModel.left - 216);
			});
		}
	}

	/**
	 * 接收已绘制好的线条的移入事件
	 */
	public acceptLineEnter(line: LineModel): void {
		line.isAllowDel = true;
		this.temporaryLine$.next(null);
	}

	/**
	 * 接收已绘制好的线条的移出事件
	 */
	public acceptLineOut(line: LineModel): void {
		line.isAllowDel = false;
		this.temporaryLine$.next(null);
	}

	/**
	 * 接收拖拽已绘制好的线条
	 */
	public acceptDraggleLine(drag: DraggablePort, line: LineModel): void {
		if (drag) {
			line.setInCanvasNum(line.inCanvasNum + drag[line.type == "h" ? "left" : "top"]);
			line.setInPanelNum(line.inPanelNum + drag[line.type == "h" ? "left" : "top"]);
		}
	}

	/**
	 * 删除横向和纵向的已绘制好的线条
	 */
	public acceptDelLine(index: number, type: "h" | "v"): void {
		this.panelScaleplateService[type == "h" ? "delHLine" : "delVLine"](index);
	}

	/**
	 * 回到原点
	 */
	public backOrigin(): void {
		this.panelScaleplateService.launchOrigin$.next();
	}

	/**
	 * 控制辅助线是显示还是隐藏
	 */
	public controlLineShowOrHide(): void {
		this.panelScaleplateService.controlLineShowOrHide();
	}

	/**
	 * 清空所有辅助线
	 */
	public emptyAllLine(): void {
		this.panelScaleplateService.emptyAllLine();
	}
}
