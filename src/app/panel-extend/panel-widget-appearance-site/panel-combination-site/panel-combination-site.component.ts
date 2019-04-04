import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";

@Component({
	selector: "app-panel-combination-site",
	template: `
		<div class="clip-site">
			<nz-collapse [nzBordered]="false">
				<nz-collapse-panel [nzHeader]="'剪贴蒙版'" [nzActive]="true">
					<app-panel-widget-clip-path [widget]="widget"></app-panel-widget-clip-path>
				</nz-collapse-panel>
			</nz-collapse>
		</div>
	`,
	styles: [``]
})
export class PanelCombinationSiteComponent implements OnInit {
	@Input()
	public widget: PanelWidgetModel;

	constructor() {}

	ngOnInit() {}
}
