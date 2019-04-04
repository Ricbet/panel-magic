import { Component, OnInit } from "@angular/core";
import { PanelSoulService } from "../panel-soul.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
	selector: "app-panel-add-new-vessel-widget-modal",
	templateUrl: "./panel-add-new-vessel-widget-modal.component.html",
	styleUrls: ["./panel-add-new-vessel-widget-modal.component.scss"]
})
export class PanelAddNewVesselWidgetModalComponent implements OnInit {
	public get validateVesselForm(): FormGroup {
		return this.panelSoulService.validateVesselForm;
	}

	constructor(private readonly panelSoulService: PanelSoulService, private readonly fb: FormBuilder) {}

	ngOnInit() {
		// 初始化表单数据
		this.panelSoulService.validateVesselForm = this.fb.group({
			name: [null, [Validators.required]],
			height: [200, [Validators.required]],
			width: [414, [Validators.required]]
		});
	}
}
