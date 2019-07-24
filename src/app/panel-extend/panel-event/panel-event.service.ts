import { Injectable } from "@angular/core";
import { EntranceModel } from "./model";
import { EventSiteModel } from "./model/event-site.model";
import { BehaviorSubject } from "rxjs";
import { PanelWidgetModel } from "../panel-widget/model";
import { get } from "lodash";
import { EventModel } from "./event-handler";

@Injectable({
    providedIn: "root",
})
export class PanelEventService {
    public entranceModel: EntranceModel = new EntranceModel();
    public eventSiteModel: EventSiteModel = new EventSiteModel();

    private _currentPanelWidgetModel: PanelWidgetModel;

    public get currentPanelWidgetModel(): PanelWidgetModel {
        return this._currentPanelWidgetModel;
    }
    public set currentPanelWidgetModel(v: PanelWidgetModel) {
        this._currentPanelWidgetModel = v;
    }

    constructor() {}

    // 当前的tabset下标位置,默认是0
    public launchCurrentEventIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    // 当前选中的且有点击事件的widget组件
    public currentWidgetHasEvent$: BehaviorSubject<PanelWidgetModel> = new BehaviorSubject<PanelWidgetModel>(null);

    // 当前选中的且有点击事件的eventHandler名称
    public get currentWidgetHasEventHandler(): EventModel {
        const _wid = this.currentWidgetHasEvent$.value;
        return _wid && get(_wid, "panelEventHandlerModel") ? _wid.panelEventHandlerModel : new EventModel();
    }

    /**
     * 接收链接设置的点击图标触发链接设置窗口,(也就是设置事件)
     */
    public openEventEntranceSite(): void {
        this.eventSiteModel.isVisibleModal$.next(!this.eventSiteModel.isVisibleModal$.value);
    }
}
