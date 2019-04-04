import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const auxiliarylineWidget = new PanelWidgetModel(<HostItemModel>{
	type: "line",
	name: "辅助线条",
	component: "FreeAuxiliaryLineViewComponent",
	icon: "xiaochengxu-zujian-11",
	autoWidget: {
		type: "line",
		content: {
			type: 1,
			bgColor: "#000",
			borderWidth: 1 // 辅助线的宽度
		},
		customfeature: { eventHandler: "", eventParams: null },
		orientationmodel: new OrientationModel(<OrientationModel>{ width: 80, height: 10 }),
		style: {
			data: {
				width: "80px",
				height: "10px",
				"line-height": "10px",
				opacity: "1",
				transform: "rotate(0deg)",
				"font-size": "12px",
				"background-color": "transparent"
			},
			children: [
				{
					data: {
						"border-top-width": "1px",
						"border-top-style": "solid",
						"border-top-color": "#000",
						width: "100%",
						height: "5px",
						display: "inline-block"
					},
					children: []
				}
			]
		}
	}
});
