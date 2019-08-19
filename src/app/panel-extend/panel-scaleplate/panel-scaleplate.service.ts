import { Inject } from "@angular/core";
import { CanvasScaleplateModel, LineModel } from "./model";
import { Subject, BehaviorSubject } from "rxjs";

@Inject({
    providedIn: "root",
})
export class PanelScaleplateService {
    public canvasScaleplateModel: CanvasScaleplateModel = new CanvasScaleplateModel();

    // 是否允许拖拽所有标尺辅助线
    public isOpenMoveLine$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // 当前是隐藏辅助线还是显示辅助线
    public isShowLine$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    // 通知回到原点并重新计算标尺
    public launchOrigin$: Subject<never> = new Subject<never>();

    constructor() {}

    // 添加新的横向线段
    public addHLine(line: LineModel): void {
        const hList = this.canvasScaleplateModel.hLineList$.value;
        hList.push(line);
        this.canvasScaleplateModel.hLineList$.next(hList);
    }

    // 添加新的纵向线段
    public addVLine(line: LineModel): void {
        const vList = this.canvasScaleplateModel.vLineList$.value;
        vList.push(line);
        this.canvasScaleplateModel.vLineList$.next(vList);
    }

    // 删除横向线段
    public delHLine(index: number): void {
        const hList = this.canvasScaleplateModel.hLineList$.value;
        hList.splice(index, 1);
        this.canvasScaleplateModel.hLineList$.next(hList);
    }

    // 删除横向线段
    public delVLine(index: number): void {
        const vList = this.canvasScaleplateModel.vLineList$.value;
        vList.splice(index, 1);
        this.canvasScaleplateModel.vLineList$.next(vList);
    }

    // 清空所有辅助线段
    public emptyAllLine(): void {
        this.canvasScaleplateModel.vLineList$.next([]);
        this.canvasScaleplateModel.hLineList$.next([]);
    }

    /**
     * 控制辅助线显示或隐藏
     */
    public controlLineShowOrHide(): void {
        this.isShowLine$.next(!this.isShowLine$.value);
    }
}
