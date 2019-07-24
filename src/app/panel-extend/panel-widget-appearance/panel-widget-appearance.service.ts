import { Injectable } from "@angular/core";
import {
    AppearanceModel,
    ConventionSiteModel,
    PanelTextModel,
    PanelFacadeModel,
    PanelFilterModel,
    alignType,
    PanelAnimationModel,
    animationLabelOptions,
} from "./model";
import { BehaviorSubject, Subject } from "rxjs";
import { PanelShadowModel } from "./model/panel-shadow.model";

@Injectable({
    providedIn: "root",
})
export class PanelWidgetAppearanceService {
    // 外观设置视图数据模型
    public appearanceModel: AppearanceModel = new AppearanceModel();
    // 外观设置组件的样式数据
    public conventionSiteModel$: BehaviorSubject<ConventionSiteModel> = new BehaviorSubject<ConventionSiteModel>(
        new ConventionSiteModel()
    );
    // 通用的文本设置组件的数据模型
    public panelTextModel$: BehaviorSubject<PanelTextModel> = new BehaviorSubject<PanelTextModel>(new PanelTextModel());
    // 通用的外观设置组件的数据模型
    public panelFacadeModel$: BehaviorSubject<PanelFacadeModel> = new BehaviorSubject<PanelFacadeModel>(
        new PanelFacadeModel()
    );
    // 通用的阴影设置组件的数据模型
    public panelShadowModel$: BehaviorSubject<PanelShadowModel> = new BehaviorSubject<PanelShadowModel>(
        new PanelShadowModel()
    );
    // 通用的滤镜设置组件的数据模型
    public panelFilterModel$: BehaviorSubject<PanelFilterModel> = new BehaviorSubject<PanelFilterModel>(
        new PanelFilterModel()
    );
    // 通用的动效设置组件的数据模型
    public panelAnimationModel$: BehaviorSubject<PanelAnimationModel> = new BehaviorSubject(new PanelAnimationModel());

    // 是否允许开启其他设置（如外观、阴影等）
    public isOpenOtherSite$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // 是否开启动效设置
    public isOpenAnimation$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // 是否允许设置旋转角度
    public isOpenRotate$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // 是否允许设置透明度
    public isOpenOpacity$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // 是否允许设置宽度
    public isOpenWidth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // 是否允许设置高度
    public isOpenHeight$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {}

    // 订阅对齐方式的可观察对象
    public launchAlignWay$: Subject<alignType> = new Subject();

    // 待选择的动效列表数据
    public awaitCheckAnimationNameList: Array<{ value: string; label: string }> = animationLabelOptions;
}
