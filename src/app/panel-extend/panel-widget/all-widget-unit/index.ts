import { richTextWidget } from "./rich-text-view/rich-text.data";
import { RichTextViewComponent, RichTextSiteViewComponent } from "./rich-text-view";
import { mapWidget } from "./map-view/map.data";
import { MapViewComponent, MapSiteViewComponent } from "./map-view";
import { TabBarSiteViewComponent } from "./tab-bar-view";
import { TabBarSiteViewModule } from "./tab-bar-view/tab-bar-site-view/tab-bar-site-view.module";
import { slideshowpictureWidget } from "./slideshow-picture-view/slideshow-picture.data";
import { SlideshowPictureViewComponent, SlideshowPictureSiteViewComponent } from "./slideshow-picture-view";
import { SlideshowPictureSiteViewModule } from "./slideshow-picture-view/slideshow-picture-site-view/slideshow-picture-site-view.module";
import { NavigationBarSiteViewModule } from "./navigation-bar-view/navigation-bar-site-view/navigation-bar-site-view.module";
import { NavigationBarSiteViewComponent } from "./navigation-bar-view";

// 所有组件本身
export const panelWidgetUnitList = [RichTextViewComponent, MapViewComponent, SlideshowPictureViewComponent];

// 所有组件的设置组件
export const panelWidgetUnitSiteList = [
	RichTextSiteViewComponent,
	MapSiteViewComponent,
	TabBarSiteViewComponent,
	NavigationBarSiteViewComponent,
	SlideshowPictureSiteViewComponent
];

// 所有部件的设置组件模块
export const panelWidgetUnitSiteModuleList = [
	TabBarSiteViewModule,
	NavigationBarSiteViewModule,
	SlideshowPictureSiteViewModule
];

export const panelSiteComponentObj = {
	richtext: RichTextSiteViewComponent,
	map: MapSiteViewComponent,
	tabbar: TabBarSiteViewComponent,
	navigationbar: NavigationBarSiteViewComponent,
	slideshowpicture: SlideshowPictureSiteViewComponent
};

export const panelWidgetFixedUnitLsit = [mapWidget, richTextWidget, slideshowpictureWidget];
