import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const linkrangeWidget = new PanelWidgetModel(<HostItemModel>{
    type: "linkrange",
    name: "链接区域",
    component: "LinkrangeWidgetComponent",
    icon: "xiaochengxu-lianjie",
    autoWidget: {
        type: "linkrange",
        content: "链接区域",
        customfeature: {
            eventParams: null,
            eventHandler: "",
        },
        orientationmodel: new OrientationModel(<OrientationModel>{ width: 50, height: 50 }),
        style: {
            data: {
                width: "50px",
                height: "50px",
                left: "0px",
                top: "0px",
                "font-weight": "normal",
                "font-style": "normal",
                transform: "rotate(0deg)",
            },
            children: [],
        },
    },
});
