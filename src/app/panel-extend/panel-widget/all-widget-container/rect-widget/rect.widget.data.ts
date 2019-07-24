import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const rectWidget = new PanelWidgetModel(<HostItemModel>{
    type: "rect",
    name: "矩形",
    component: "FreeRectViewComponent",
    icon: "xiaochengxu-zujian-12",
    autoWidget: {
        type: "rect",
        content: "矩形",
        customfeature: {
            eventParams: null,
            eventHandler: "",
        },
        orientationmodel: new OrientationModel(<OrientationModel>{ width: 100, height: 50 }),
        style: {
            data: {
                width: "100px",
                height: "50px",
                left: "0px",
                top: "0px",
                padding: "0px",
                "border-width": "1px",
                "border-style": "solid",
                opacity: "1",
                transform: "rotate(0deg)",
                "background-color": "#fff",
            },
            children: [],
        },
    },
});
