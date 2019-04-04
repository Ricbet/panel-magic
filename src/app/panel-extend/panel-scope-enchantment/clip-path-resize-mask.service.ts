import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import {
	ClipPathMaskModel,
	ClipInsetModel,
	ClipCircleModel,
	ClipEllipseModel,
	ClipPolygonModel,
	TPolygonType,
	ClipPointModel
} from "./model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";

@Injectable()
export class ClipPathResizeMaskService {
	// 剪贴蒙版数据模型
	public clipPathMaskModel: ClipPathMaskModel = new ClipPathMaskModel();
	// 正方形inset的数据模型
	public clipInsetModel$: BehaviorSubject<ClipInsetModel> = new BehaviorSubject<ClipInsetModel>(null);
	// 圆形circle的蒙版数据模型
	public clipCircleModel$: BehaviorSubject<ClipCircleModel> = new BehaviorSubject<ClipCircleModel>(null);
	// 椭圆ellipse的蒙版数据模型
	public clipEllipseModel$: BehaviorSubject<ClipEllipseModel> = new BehaviorSubject<ClipEllipseModel>(null);
	// 多边形polygon的蒙版数据模型
	public clipPolygonModel$: BehaviorSubject<ClipPolygonModel> = new BehaviorSubject<ClipPolygonModel>(null);

	// 负责发射鼠标移动的坐标点和当前被拖拽的clipPoint笔触点
	public launchMouseDragClipPoint: Subject<{ drag: DraggablePort; point: ClipPointModel }> = new Subject();

	constructor() {}

	/**
	 * 重置蒙版
	 */
	public emptyClipPath(): void {
		this.clipPathMaskModel.currentPathType$.next("");
		this.clipInsetModel$.next(null);
		this.clipCircleModel$.next(null);
		this.clipEllipseModel$.next(null);
		this.clipPolygonModel$.next(null);
	}

	/**
	 * 创建正方形蒙版
	 */
	public createInsetClip(model: ClipInsetModel = null): void {
		if (!model) {
			model = new ClipInsetModel();
			model.createPath();
		}
		this.clipInsetModel$.next(model);
		this.clipPathMaskModel.currentPathType$.next("inset");
	}

	/**
	 * 创建圆形蒙版
	 */
	public createCircleClip(model: ClipCircleModel = null): void {
		if (!model) {
			model = new ClipCircleModel();
			model.createPath();
		}
		this.clipCircleModel$.next(model);
		this.clipPathMaskModel.currentPathType$.next("circle");
	}

	/**
	 * 创建椭圆蒙版
	 */
	public createEllipseClip(model: ClipEllipseModel = null): void {
		if (!model) {
			model = new ClipEllipseModel();
			model.createPath();
		}
		this.clipEllipseModel$.next(model);
		this.clipPathMaskModel.currentPathType$.next("ellipse");
	}

	/**
	 * 创建多边形
	 */
	public createPolygonClip(type: TPolygonType, model: ClipPolygonModel = null): void {
		if (!model) {
			model = new ClipPolygonModel();
			model.createPath(type);
		}
		this.clipPolygonModel$.next(model);
		this.clipPathMaskModel.currentPathType$.next("polygon");
	}
}
