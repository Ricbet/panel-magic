import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const richTextWidget = new PanelWidgetModel(<HostItemModel>{
    type: "richtext",
    name: "富文本",
    component: "RichTextViewComponent",
    icon: "xiaochengxu-zujian-4",
    autoWidget: {
        type: "richtext",
        content: `<p>这里是富文本内容</p>`,
        orientationmodel: new OrientationModel(<OrientationModel>{ width: 414, height: 80 }),
        customfeature: {},
        style: {
            data: {
                height: "80px",
                width: "414px",
                opacity: "1",
                "text-align": "left",
                "border-style": "none",
                "line-height": "24px",
            },
            children: [],
        },
    },
});
