import { Component, OnInit, Input, ViewChild } from "@angular/core";

import { Subscription } from "rxjs";

import { NzNotificationService } from "ng-zorro-antd";
import { AmapAutocompleteService, AmapAutocompleteWrapper } from "ngx-amap";
import { WidgetModel } from "../../../model/widget.model";

@Component({
	selector: "app-map-site-view",
	templateUrl: "./map-site-view.component.html",
	styleUrls: ["./map-site-view.component.scss"]
})
export class MapSiteViewComponent implements OnInit {
	@ViewChild("map", { static: true }) private map: any;

	private plugin: Promise<AmapAutocompleteWrapper>;
	// 地图事件监听
	private _subscription: Subscription;
	private _autoWidget: WidgetModel = new WidgetModel();

	@Input()
	public get autoWidget(): WidgetModel {
		return this._autoWidget;
	}
	public set autoWidget(v: WidgetModel) {
		this._autoWidget = v;
	}

	constructor(
		private AmapAutocomplete: AmapAutocompleteService,
		private nzNotificationService: NzNotificationService
	) {}

	ngOnInit() {
		this.plugin = this.AmapAutocomplete.of({
			input: "address"
		});

		this.plugin.then(res => {
			// console.log( res )
			this._subscription = res.on("select").subscribe(event => {
				if (event.poi.id == "") {
					this.nzNotificationService.create("warning", "地址错误", "请重新输入地址");
				} else {
					let _location = event.poi.location;
					let _name = event.poi.name;
					let _address = event.poi.address;
					let _district = event.poi.district;
					this.autoWidget["content"]["mapModel"]["coordinates"] = [_location.M, _location.O];
					this.autoWidget["content"]["mapModel"]["address"] = _name;
					this.autoWidget["content"]["mapModel"]["text"] = _district + _address + _name;
					this.autoWidget["content"]["mapModel"].handleMarkers();
				}
			});
		});
	}

	ngAfterViewInit() {
		this.map.mapClick.subscribe(res => {
			if (res["type"] == "click") {
				this.map.setCenter(res["lnglat"]);
				this.autoWidget["content"]["mapModel"]["coordinates"] = [res["lnglat"]["M"], res["lnglat"]["O"]];
				this.map.getCity().then(_res => {
					this.autoWidget["content"]["mapModel"]["address"] = _res["district"];
					this.autoWidget["content"]["mapModel"]["text"] = _res["province"] + _res["city"] + _res["district"];
					this.autoWidget["content"]["mapModel"].handleMarkers();
				});
			}
		});
	}

	ngOnDestroy() {
		if (this._subscription) this._subscription.unsubscribe();
	}

	// 接收标记拖拽的函数
	public acceptMarkerMovEnd(res: any): void {
		if (res["type"] == "dragend") {
			this.map.setCenter(res["lnglat"]);
			this.autoWidget["content"]["mapModel"]["coordinates"] = [res["lnglat"]["M"], res["lnglat"]["O"]];
			this.map.getCity().then(_res => {
				this.autoWidget["content"]["mapModel"]["address"] = _res["district"];
				this.autoWidget["content"]["mapModel"]["text"] = _res["province"] + _res["city"] + _res["district"];
				this.autoWidget["content"]["mapModel"].handleMarkers();
			});
		}
	}
}
