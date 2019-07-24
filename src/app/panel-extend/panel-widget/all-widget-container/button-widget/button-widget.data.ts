import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const buttonWidget = new PanelWidgetModel(<HostItemModel>{
    type: "button",
    name: "按钮",
    component: "FreeButtonViewComponent",
    icon: "xiaochengxu-zujian-1",
    autoWidget: {
        type: "button",
        content: "按钮",
        customfeature: {
            eventParams: null,
            eventHandler: "",
        },
        orientationmodel: new OrientationModel(<OrientationModel>{ width: 100, height: 30 }),
        style: {
            data: {
                color: "#fff",
                height: "30px",
                width: "100px",
                "line-height": "30px",
                "background-color": "#34b6fd",
                "border-radius": "0px",
                opacity: "1",
                "font-size": "14px",
                "text-align": "center",
                "border-style": "none",
                "border-width": "2px",
                "border-color": "#333",
                transform: "rotate(0deg)",
            },
            children: [],
        },
    },
});
