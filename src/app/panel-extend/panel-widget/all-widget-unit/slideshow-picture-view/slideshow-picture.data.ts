import { PanelWidgetModel } from "../../model";
import { OrientationModel } from "../../model/orientation.model";
import { PictureAdModel } from "./slideshow-picture-site-view/picture-ad-image-item/model";
import { HostItemModel } from "../../model/host.model";

export const slideshowpictureWidget = new PanelWidgetModel(<HostItemModel>{
	type: "slideshowpicture",
	name: "轮播图",
	component: "SlideshowPictureViewComponent",
	icon: "xiaochengxu-zujian-3",
	autoWidget: {
		type: "slideshowpicture",
		content: {
			pictureAdModel: new PictureAdModel(),
			templateType: 1
		},
		orientationmodel: new OrientationModel(<OrientationModel>{ width: 414, height: 200 }),
		customfeature: {},
		style: {
			data: {},
			children: []
		}
	}
});
