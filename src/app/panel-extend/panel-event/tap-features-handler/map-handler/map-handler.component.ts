import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AmapAutocompleteWrapper, AmapAutocompleteService } from "ngx-amap";
import { NzNotificationService } from "ng-zorro-antd";
import { MapModel, IMarkersable } from "./model";
import { PanelEventService } from "../../panel-event.service";
import { TapMapHandler } from "../../event-handler/tap-map-handler";
import { EnumEventHandler } from "../../model";

@Component({
    selector: "app-map-handler",
    templateUrl: "./map-handler.component.html",
    styleUrls: ["./map-handler.component.scss"],
})
export class MapHandlerComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("map", { static: true }) private map: any;
    private isShowEventSite$: Subscription;

    private plugin: Promise<AmapAutocompleteWrapper>;
    // 地图事件监听
    private _subscription: Subscription;

    // 地图数据模型
    public mapModel: MapModel = new MapModel();

    // 地图事件数据模型
    public currentTapMapHandler: TapMapHandler = new TapMapHandler();

    constructor(
        private readonly AmapAutocomplete: AmapAutocompleteService,
        private readonly panelEventService: PanelEventService,
        private readonly nzNotificationService: NzNotificationService
    ) {
        this.isShowEventSite$ = this.panelEventService.eventSiteModel.isVisibleModal$.subscribe(b => {
            if (b == true) {
                const _inset_widget = this.panelEventService.currentPanelWidgetModel;
                if (_inset_widget) {
                    const _auto_event = _inset_widget.panelEventHandlerModel;
                    if (_auto_event && _auto_event.eventHandler == "tapToMapHandler") {
                        const _event_map_params: IMarkersable = <IMarkersable>(<any>_auto_event.eventParams);
                        this.panelEventService.launchCurrentEventIndex$.next(EnumEventHandler["tapFeaturesHandler"]);
                        this.currentTapMapHandler.markersable = _event_map_params;
                        this.mapModel.coordinates = [_event_map_params.longitude, _event_map_params.latitude];
                        this.mapModel.address = _event_map_params.name;
                        this.mapModel.text = _event_map_params.desc;
                    }
                }
            } else {
                this.currentTapMapHandler = new TapMapHandler();
            }
        });
    }

    ngOnInit() {
        this.plugin = this.AmapAutocomplete.of({
            input: "address",
        });
        this.plugin.then(res => {
            this._subscription = res.on("select").subscribe(event => {
                if (event.poi.id == "") {
                    this.nzNotificationService.create("warning", "地址错误", "请重新输入地址");
                } else {
                    const _location = event.poi.location;
                    const _name = event.poi.name;
                    const _address = event.poi.address;
                    const _district = event.poi.district;
                    this.mapModel.coordinates = [_location.M, _location.O];
                    this.mapModel.address = _name;
                    this.mapModel.text = _district + _address + _name;
                    this.acceptMapEventChange();
                }
            });
        });
    }

    ngAfterViewInit() {
        this.map.mapClick.subscribe(res => {
            if (res["type"] == "click") {
                this.map.setCenter(res.lnglat);
                this.mapModel.coordinates = [res.lnglat.M, res.lnglat.O];
                this.map.getCity().then(_res => {
                    this.mapModel.address = _res.district;
                    this.mapModel.text = _res.province + _res.city + _res.district;
                    this.acceptMapEventChange();
                });
            }
        });
    }

    ngOnDestroy() {
        if (this._subscription) this._subscription.unsubscribe();
        if (this.isShowEventSite$) this.isShowEventSite$.unsubscribe();
    }

    /**
     * 接收地图选择某一个地址的回调
     */
    public acceptMapEventChange(): void {
        this.mapModel.handleMarkers();
        if (Array.isArray(this.mapModel.markers) && this.mapModel.markers.length > 0) {
            this.currentTapMapHandler.markersable = this.mapModel.markers[0];
            this.panelEventService.eventSiteModel.currentEventModel$.next(this.currentTapMapHandler);
        }
    }

    /**
     * 接收标记拖拽的函数
     */
    public acceptMarkerMovEnd(res: any): void {
        if (res["type"] == "dragend") {
            this.map.setCenter(res.lnglat);
            this.mapModel.coordinates = [res.lnglat.M, res.lnglat.O];
            this.map.getCity().then(_res => {
                this.mapModel.address = _res.district;
                this.mapModel.text = _res.province + _res.city + _res.district;
                this.mapModel.handleMarkers();
            });
        }
    }
}
