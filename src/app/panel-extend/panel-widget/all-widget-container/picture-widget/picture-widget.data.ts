import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { HostItemModel } from "../../model/host.model";

export const pictureWidget = new PanelWidgetModel(<HostItemModel>{
	type: "picture",
	name: "图片",
	component: "FreePictureViewComponent",
	icon: "xiaochengxu-zujian-3",
	autoWidget: {
		type: "picture",
		customfeature: {
			eventParams: null,
			eventHandler: ""
		},
		orientationmodel: new OrientationModel(<OrientationModel>{ width: 80, height: 80 }),
		style: {
			data: {
				width: "80px",
				height: "80px",
				transform: "rotate(0deg)"
			},
			children: []
		}
	}
});
