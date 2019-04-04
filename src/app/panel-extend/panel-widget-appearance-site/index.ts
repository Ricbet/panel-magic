import { PanelButtonSiteComponent } from "./panel-button-site/panel-button-site.component";
import { PanelLineSiteComponent } from "./panel-line-site/panel-line-site.component";
import { PanelPictureSiteComponent } from "./panel-picture-site/panel-picture-site.component";
import { PanelTextSiteComponent } from "./panel-text-site/panel-text-site.component";
import { PanelRectSiteComponent } from "./panel-rect-site/panel-rect-site.component";
import { PanelCombinationSiteComponent } from "./panel-combination-site/panel-combination-site.component";
import { PanelLinkrangeSiteComponent } from "./panel-linkrange-site/panel-linkrange-site.component";
import { PanelSlideshowPictureSiteComponent } from "./panel-slideshow-picture-site/panel-slideshow-picture-site.component";
import { PanelMapSiteComponent } from "./panel-map-site/panel-map-site.component";

export const panelSiteComponentList = [
	PanelButtonSiteComponent,
	PanelLineSiteComponent,
	PanelPictureSiteComponent,
	PanelTextSiteComponent,
	PanelRectSiteComponent,
	PanelCombinationSiteComponent,
	PanelLinkrangeSiteComponent,
	PanelSlideshowPictureSiteComponent,
	PanelMapSiteComponent
];

export const panelSiteComponentObj = {
	text: PanelTextSiteComponent,
	picture: PanelPictureSiteComponent,
	button: PanelButtonSiteComponent,
	line: PanelLineSiteComponent,
	rect: PanelRectSiteComponent,
	combination: PanelCombinationSiteComponent,
	linkrange: PanelLinkrangeSiteComponent,
	slideshowpicture: PanelSlideshowPictureSiteComponent,
	map: PanelMapSiteComponent
};
