import { ButtonWidgetComponent } from "./button-widget/button-widget.component";
import { AuxiliarylineWidgetComponent } from "./auxiliaryline-widget/auxiliaryline-widget.component";
import { PictureWidgetComponent } from "./picture-widget/picture-widget.component";
import { TextWidgetComponent } from "./text-widget/text-widget.component";
import { RectWidgetComponent } from "./rect-widget/rect-widget.component";
import { LinkrangeWidgetComponent } from "./linkrange-widget/linkrange-widget.component";
import { PanelWidgetModel } from "../model";
import { auxiliarylineWidget } from "./auxiliaryline-widget/auxiliaryline-widget.data";
import { buttonWidget } from "./button-widget/button-widget.data";
import { pictureWidget } from "./picture-widget/picture-widget.data";
import { rectWidget } from "./rect-widget/rect.widget.data";
import { textWidget } from "./text-widget/text-widget.data";
import { OrientationModel } from "../model/orientation.model";
import { linkrangeWidget } from "./linkrange-widget/linkrange-widget.data";
import { HostItemModel } from "../model/host.model";

export const panelWidgetComponentList = [
    ButtonWidgetComponent,
    AuxiliarylineWidgetComponent,
    PictureWidgetComponent,
    TextWidgetComponent,
    RectWidgetComponent,
    LinkrangeWidgetComponent,
];

export const panelWidgetComponentObj = {
    text: TextWidgetComponent,
    picture: PictureWidgetComponent,
    button: ButtonWidgetComponent,
    line: AuxiliarylineWidgetComponent,
    rect: RectWidgetComponent,
    linkrange: LinkrangeWidgetComponent,
};

export const panelWidgetFixedContainerLsit: Array<PanelWidgetModel> = [
    auxiliarylineWidget,
    buttonWidget,
    pictureWidget,
    rectWidget,
    textWidget,
    linkrangeWidget,
    new PanelWidgetModel(<HostItemModel>{
        type: "combination",
        name: "组合",
        component: "FreeCombinationViewComponent",
        icon: "",
        autoWidget: {
            type: "combination",
            content: [],
            customfeature: {
                eventParams: null,
                eventHandler: "",
            },
            orientationmodel: new OrientationModel(<OrientationModel>{ width: 0, height: 0 }),
            style: {
                data: {},
                children: [],
            },
        },
    }),
];
