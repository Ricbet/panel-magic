import { Component, OnInit, ComponentRef, ViewContainerRef, ViewChild, ComponentFactoryResolver } from "@angular/core";
import { DetailsModel } from "./model";
import { PanelWidgetDetailsSiteService } from "./panel-widget-details.service";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { allPanelWidgetSiteObj } from "../panel-widget";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment/panel-scope-enchantment.service";
import { Subscription, BehaviorSubject } from "rxjs";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance/panel-widget-appearance.service";
import { PanelWidgetModel } from "../panel-widget/model";

@Component({
    selector: "app-panel-widget-details",
    templateUrl: "./panel-widget-details.component.html",
    styleUrls: ["./panel-widget-details.component.scss"],
})
export class PanelWidgetDetailsSiteComponent implements OnInit {
    // 订阅被选中的组件列表
    private outerSphereInsetWidgetRX$: Subscription;
    // 主动创建对应的设置组件并显示
    private launchTypeDetailsViewRX$: Subscription;

    public currentComponentRef: ComponentRef<any>;

    // 当前组件设置的标题
    public currentDetailsTitle$: BehaviorSubject<string> = new BehaviorSubject<string>("组件设置");

    public get detailsModel(): DetailsModel {
        return this.panelWidgetDetailsSiteService.detailsModel;
    }

    @ViewChild("widgetSiteContainer", { read: ViewContainerRef, static: true })
    public widgetSiteContainer: ViewContainerRef;

    constructor(
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelWidgetDetailsSiteService: PanelWidgetDetailsSiteService
    ) {
        this.outerSphereInsetWidgetRX$ = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.subscribe(
            value => {
                this.initDetailsTitle();
                if (Array.isArray(value) && value.length == 1) {
                    this.createSiteComponent(value[0].type);
                } else if (value.length != 1) {
                    this.panelWidgetDetailsSiteService.detailsModel.isShow$.next(false);
                    if (this.widgetSiteContainer) this.widgetSiteContainer.clear();
                    if (this.currentComponentRef) this.currentComponentRef.destroy();
                }
            }
        );
        this.launchTypeDetailsViewRX$ = this.panelWidgetDetailsSiteService.launchTypeDetailsView$.subscribe(value => {
            if (value) {
                if (value.title) {
                    this.currentDetailsTitle$.next(value.title);
                } else {
                    this.initDetailsTitle();
                }
                this.createSiteComponent(value.type, value.widget);
            }
        });
    }

    ngOnInit() {
        // 根据窗口的大小重新定位组件设置的位置
        // this.detailsModel.left = window.innerWidth - 600
    }

    ngOnDestroy() {
        if (this.outerSphereInsetWidgetRX$) this.outerSphereInsetWidgetRX$.unsubscribe();
        if (this.launchTypeDetailsViewRX$) this.launchTypeDetailsViewRX$.unsubscribe();
    }

    /**
     * 重置组件设置标题名称
     */
    public initDetailsTitle(): void {
        this.currentDetailsTitle$.next("组件设置");
    }

    /**
     * 接收头部拖拽回来的数据
     */
    public acceptDraggableData(data: DraggablePort): void {
        if (data) {
            this.detailsModel.top += data.top;
            this.detailsModel.left += data.left;
        }
    }

    /**
     * 创建部件自己的设置项目
     */
    public createSiteComponent(
        type: string,
        widget: PanelWidgetModel = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$
            .value[0]
    ): void {
        if (allPanelWidgetSiteObj[type]) {
            this.panelWidgetDetailsSiteService.detailsModel.isShow$.next(true);
            this.widgetSiteContainer.clear();
            this.currentComponentRef = this.widgetSiteContainer.createComponent(
                this.componentFactoryResolver.resolveComponentFactory(allPanelWidgetSiteObj[type])
            );
            if (this.currentComponentRef && this.currentComponentRef.instance.autoWidget) {
                this.currentComponentRef.instance.autoWidget = widget.autoWidget;
            }
        }
    }

    /**
     * 隐藏组件设置
     */
    public closeDetails(): void {
        this.detailsModel.isShow$.next(false);
    }

    /**
     * 点击组件设置设置最高层级
     */
    public acceptDetailsDown(): void {
        this.detailsModel.zIndex = this.panelWidgetAppearanceService.appearanceModel.zIndex + 1;
    }
}
