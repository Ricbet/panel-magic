import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { ImageGalleryComponent } from "./image-gallery.component";

import { ImageGalleryService } from "./image-gallery.service";

import { ShareModule } from "@ng-share";
import { GalleryGroupComponent } from "./gallery-group/gallery-group.component";
import { GalleryGroupService } from "./gallery-group/gallery-group.service";
import { GalleryPictureColumnComponent } from "./gallery-picture-column/gallery-picture-column.component";
import { GalleryPictureColumnService } from "./gallery-picture-column/gallery-picture-column.service";
import { GalleryPictureCheckedComponent } from "./gallery-picture-checked/gallery-picture-checked.component";

@NgModule({
	imports: [CommonModule, ShareModule, HttpClientModule],
	providers: [ImageGalleryService, GalleryGroupService, GalleryPictureColumnService],
	exports: [ImageGalleryComponent],
	declarations: [
		ImageGalleryComponent,
		GalleryGroupComponent,
		GalleryPictureColumnComponent,
		GalleryPictureCheckedComponent
	]
})
export class ImageGalleryModule {}
