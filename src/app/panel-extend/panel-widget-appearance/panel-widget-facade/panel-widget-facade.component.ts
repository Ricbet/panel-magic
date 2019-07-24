import { Component, OnInit, Input, SimpleChanges, Output } from "@angular/core";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance.service";
import { PanelFacadeModel } from "../model";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { PanelWidgetModel } from "../../panel-widget/model";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: "app-panel-widget-facade",
    templateUrl: "./panel-widget-facade.component.html",
    styleUrls: ["./panel-widget-facade.component.scss"],
})
export class PanelWidgetFacadeComponent implements OnInit {
    @Input() public widget: PanelWidgetModel;
    /**
     * 不显示某一项设置的数组列表
     * quick： 不启动一键正方形和圆形
     * bgColor：不启动背景色
     * radius： 不启动圆角
     * border: 不启动边框
     * noneStyle: 不下拉选择无的边框样式
     */
    @Input() public noSiteList: Array<string> = [];
    @Output() public launchEmitFacadeValueChange: Subject<PanelFacadeModel> = new Subject<PanelFacadeModel>();

    // 边框外观设置的所有值变化可订阅对象
    private panelFacadeValueChangeRX$: Subscription;
    public get panelFacade(): PanelFacadeModel {
        return this.panelWidgetAppearanceService.panelFacadeModel$.value;
    }
    constructor(
        private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
    ) {
        this.panelFacadeValueChangeRX$ = this.panelFacade.valueChange$.pipe(debounceTime(10)).subscribe(value => {
            if (value) {
                // this.handleOnesInsetWidgetFacade()
                this.launchEmitFacadeValueChange.next(this.panelFacade);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.panelFacadeValueChangeRX$) this.panelFacadeValueChangeRX$.unsubscribe();
    }
    ngOnChanges(change: SimpleChanges) {
        if (change.widget) {
            if (this.widget.panelFacadeModel) {
                this.panelFacade.setData(this.widget.panelFacadeModel.getValue());
            }
        }
    }

    /**
     * 处理只有一个组件的时候的外观设置
     */
    public handleOnesInsetWidgetFacade(): void {
        const facade = this.panelFacade;
        const text = this.widget.panelTextModel;
        const wHeight = this.widget.conventionSiteModel.height;
        const allStyle = {
            ...facade.styleContent(),
            "line-height": text.styleContent(wHeight - (facade.borderStyle != "none" ? facade.borderNumber * 2 : 0))[
                "line-height"
            ],
        };
        this.widget.addStyleToUltimatelyStyle(allStyle);
        this.widget.panelFacadeModel.setData(facade.getValue());
    }

    /**
     * 接收边框的联动按钮选项
     */
    public acceptLinkageTag(bool: boolean): void {
        const facade = this.panelFacade;
        facade.isRadiusAssociated = bool;
        if (bool == true) {
            const maxRadius = Math.max(facade.ltRadius, facade.rtRadius, facade.lbRadius, facade.rbRadius);
            facade.setData({
                ltRadius: maxRadius,
                rtRadius: maxRadius,
                lbRadius: maxRadius,
                rbRadius: maxRadius,
            });
        }
    }

    /**
     * 接收圆角的四个角度值的变化
     */
    public acceptFourRadiusChange(number: number): void {
        const facade = this.panelFacade;
        if (facade.isRadiusAssociated == true) {
            facade.setData({
                ltRadius: number,
                rtRadius: number,
                lbRadius: number,
                rbRadius: number,
            });
        }
    }

    /**
     * 一键正方形
     */
    public quickSquare(): void {
        this.panelFacade.isRadiusAssociated = true;
        const max = Math.max(this.widget.conventionSiteModel.height, this.widget.conventionSiteModel.width);
        this.widget.panelFacadeModel.setData({
            ltRadius: 0,
            rtRadius: 0,
            lbRadius: 0,
            rbRadius: 0,
        });
        this.widget.addStyleToUltimatelyStyle({
            width: `${max}px`,
            height: `${max}px`,
            "border-radius": "0px",
        });
        this.widget.profileModel.setData({
            width: max,
            height: max,
        });
        this.acceptFourRadiusChange(0);
        this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({
            isLaunch: false,
        });
    }

    /**
     * 一键圆形
     */
    public quickRound(): void {
        this.panelFacade.isRadiusAssociated = true;
        let maxF = 0;
        const max = Math.max(this.widget.conventionSiteModel.height, this.widget.conventionSiteModel.width);
        maxF = Math.max(max, maxF);
        this.widget.panelFacadeModel.setData({
            ltRadius: Math.ceil(max / 2),
            rtRadius: Math.ceil(max / 2),
            lbRadius: Math.ceil(max / 2),
            rbRadius: Math.ceil(max / 2),
        });
        this.widget.addStyleToUltimatelyStyle({
            width: `${max}px`,
            height: `${max}px`,
            "border-radius": this.widget.panelFacadeModel.styleContent()["border-radius"],
        });
        this.widget.profileModel.setData({
            width: max,
            height: max,
        });
        this.acceptFourRadiusChange(maxF);
        this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({
            isLaunch: false,
        });
    }

    /**
     * 设定背景色为透明
     */
    public bgTransparent(): void {
        this.panelFacade.setData({
            bgColor: "transparent",
        });
    }
}
