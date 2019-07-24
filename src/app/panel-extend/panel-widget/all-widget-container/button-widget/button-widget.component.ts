import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../model";

@Component({
    selector: "app-button-widget",
    templateUrl: "./button-widget.component.html",
    styles: [""],
})
export class ButtonWidgetComponent implements OnInit {
    private _widget: PanelWidgetModel;

    @Input()
    public get widget(): PanelWidgetModel {
        return this._widget;
    }
    public set widget(v: PanelWidgetModel) {
        this._widget = v;
    }
    constructor() {}

    ngOnInit() {}
}
