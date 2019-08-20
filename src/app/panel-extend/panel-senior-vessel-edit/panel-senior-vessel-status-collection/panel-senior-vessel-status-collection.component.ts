import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { PanelSeniorVesselEditService } from "../panel-senior-vessel-edit.service";
import { VesselWidgetModel, VesselStatusCollectionModel } from "../model";
import { PanelSeniorVesselStatusCollectionService } from "./panel-senior-vessel-status-collection.service";
import { PanelExtendService } from "app/panel-extend/panel-extend.service";

@Component({
    selector: "app-panel-senior-vessel-status-collection",
    templateUrl: "./panel-senior-vessel-status-collection.component.html",
    styleUrls: ["./panel-senior-vessel-status-collection.component.scss"],
})
export class PanelSeniorVesselStatusCollectionComponent implements OnInit {
    @ViewChild("editInputEl", { static: false }) public editInputEl: ElementRef;
    public get vesselWidgetModel(): VesselWidgetModel {
        return this.panelSeniorVesselEditService.vesselWidgetModel$.value;
    }
    public get currentStatus(): string {
        return this.vesselWidgetModel.currentStatusId;
    }

    constructor(
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
        private readonly panelExtendService: PanelExtendService
    ) {}

    ngOnInit() {}

    /**
     * 添加新状态
     */
    public addNewStatus(): void {
        const length = this.vesselWidgetModel.statusWarehouseCollection.length;
        this.vesselWidgetModel.addNewStatusCollection(`状态 ${length + 1}`);
    }

    /**
     * 双击状态进入编辑状态名称模式
     */
    public acceptDbClickStatus(status: VesselStatusCollectionModel): void {
        status.isEdit = true;
        setTimeout(() => {
            this.editInputEl.nativeElement.focus();
        });
    }

    /**
     * 编辑状态下的输入框失去焦点之后
     */
    public popEditStatusAffirm(status: VesselStatusCollectionModel): void {
        status.isEdit = false;
    }

    /**
     * 选中的当前状态
     */
    public checkStatus(status: VesselStatusCollectionModel): void {
        this.panelSeniorVesselEditService.currentStatusInVesselInfo.widgetList = this.panelExtendService.handleSaveWidgetToOrientationModelData(
            this.panelSeniorVesselEditService.riverDiversionWidgetList$.value
        );
        if (status.uniqueId != this.panelSeniorVesselEditService.currentStatusInVesselInfo.uniqueId) {
            this.vesselWidgetModel.currentStatusId = status.uniqueId;
            this.panelSeniorVesselEditService.launchCurrentStatusIdChange$.next(status.uniqueId);
        }
    }

    /**
     * 删除对应的状态
     */
    public deleteStatus(status: VesselStatusCollectionModel, index: number): void {
        this.vesselWidgetModel.delStatusCollection(status, index);
        // 然后默认选中第一个状态
        this.checkStatus(this.vesselWidgetModel.statusWarehouseCollection[0]);
    }
}
