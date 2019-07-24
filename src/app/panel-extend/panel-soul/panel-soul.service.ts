import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { PanelWidgetModel } from "../panel-widget/model";
import { FormGroup } from "@angular/forms";
import { HostItemModel } from "../panel-widget/model/host.model";

@Injectable({
    providedIn: "root",
})
export class PanelSoulService {
    // 当前组件库列表
    public fixedWidget$: BehaviorSubject<Array<HostItemModel>> = new BehaviorSubject([]);

    // 当前部件库的列表
    public fixedWidgetUnit$: BehaviorSubject<Array<HostItemModel>> = new BehaviorSubject([]);

    // 当前动态容器库的列表
    public fixedWidgetVessel$: BehaviorSubject<Array<HostItemModel>> = new BehaviorSubject([]);

    // 待创建的组件库数据模型
    public awaitWidgetVessel$: BehaviorSubject<PanelWidgetModel> = new BehaviorSubject(null);

    // 新建动态容器弹窗的表单类
    public validateVesselForm: FormGroup;

    constructor() {}
}
