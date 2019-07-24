import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const textWidget = new PanelWidgetModel(<HostItemModel>{
    type: "text",
    name: "文本",
    component: "FreeTextViewComponent",
    icon: "xiaochengxu-zujian-5",
    autoWidget: {
        type: "text",
        content: "文本",
        customfeature: {
            eventParams: null,
            eventHandler: "",
        },
        orientationmodel: new OrientationModel(<OrientationModel>{ width: 24, height: 24 }),
        style: {
            data: {
                color: "#333",
                height: "24px",
                width: "24px",
                opacity: "1",
                "font-size": "12px",
                "text-align": "left",
                "border-style": "none",
                "line-height": "24px",
                transform: "rotate(0deg)",
            },
            children: [],
        },
    },
});
