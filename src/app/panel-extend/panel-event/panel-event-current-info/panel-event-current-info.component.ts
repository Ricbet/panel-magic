import { Component, OnInit, Input } from "@angular/core";
import { EventModel } from "../event-handler";
import { AppDataService } from "app/appdata/appdata.service";
import { get } from "lodash";
import { PanelSeniorVesselEditService } from "app/panel-extend/panel-senior-vessel-edit/panel-senior-vessel-edit.service";

@Component({
	selector: "app-panel-event-current-info",
	templateUrl: "./panel-event-current-info.component.html",
	styleUrls: ["./panel-event-current-info.component.scss"]
})
export class PanelEventCurrentInfoComponent implements OnInit {
	@Input() public currentWidgetHasEventHandler: EventModel;

	// 当前的appId
	public get currentAppId(): string {
		return this.appDataService.appDataModel.app_id;
	}

	constructor(
		private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
		private readonly appDataService: AppDataService
	) {}

	ngOnInit() {}

	/**
	 * 根据page页面路径返回页面名称
	 */
	public conversionPageRouterName(page: string): string {
		const _page = this.appDataService.appDataModel.app_data[page];
		return _page && get(_page, "customfeature.name") ? _page.customfeature.name : "";
	}

	/**
	 * 根据状态id返回状态名称
	 */
	public conversionVesselStatusName(statusId: string): string {
		const _status = this.panelSeniorVesselEditService.vesselWidgetModel$.value;
		return _status.repertoryStatusWarehouse[statusId] ? _status.repertoryStatusWarehouse[statusId].name : "";
	}
}
