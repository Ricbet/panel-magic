import { PanelWidgetModel } from "../../model";
import { MapModel } from "./map-site-view/model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const mapWidget = new PanelWidgetModel(<HostItemModel>{
    type: "map",
    name: "地图",
    component: "MapViewComponent",
    icon: "xiaochengxu-zujian-8",
    autoWidget: {
        type: "map",
        content: {
            mapModel: new MapModel(),
        },
        orientationmodel: new OrientationModel(<OrientationModel>{ width: 414, height: 200 }),
        customfeature: {},
        style: {
            data: {
                "font-size": "12px",
                color: "#000",
            },
            children: [],
        },
    },
});
