import { NgModule } from "@angular/core";

import { FileUrlPipe } from "./file-url.pipe";
import { JsonParsePipe } from "./json-parse.pipe";
import { SafeInnerHtmlPipe } from "./safeInner-html.pipe";

@NgModule({
    declarations: [SafeInnerHtmlPipe, FileUrlPipe, JsonParsePipe],
    exports: [SafeInnerHtmlPipe, FileUrlPipe, JsonParsePipe],
    providers: [SafeInnerHtmlPipe, FileUrlPipe, JsonParsePipe],
})
export class PipesModule {}
