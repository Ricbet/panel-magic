import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from "@angular/core";

class ViewModel {
	placeholder: string = ""; // 输入框文本提示
	name: string = ""; // 输入框的名称
	backupName: string = ""; // 备份名称，用于点击取消名称时候返回该名称
}

@Component({
	selector: "app-new-item",
	templateUrl: "./new-item.component.html",
	styleUrls: ["./new-item.component.scss"]
})
export class NewItemComponent implements OnInit, OnDestroy {
	public viewModel: ViewModel = new ViewModel();

	@Output()
	public emitData: EventEmitter<{ type: string; data: string }> = new EventEmitter<{ type: string; data: string }>();

	@ViewChild("editInputEl", { static: true }) public editInputEl: ElementRef;

	@Input()
	public set placeholder(v: string) {
		this.viewModel.placeholder = v;
	}
	public get placeholder(): string {
		return this.viewModel.placeholder;
	}

	@Input()
	public get name(): string {
		return this.viewModel.name;
	}
	public set name(v: string) {
		this.viewModel.name = v;
		this.viewModel.backupName = v;
	}

	constructor() {}

	ngOnInit() {
		this.editInputEl.nativeElement.focus();
	}

	ngOnDestroy() {}

	public popAffirm(): void {
		this.emitData.emit({
			type: "affirm",
			data: this.viewModel.name
		});
	}

	public popClose(): void {
		this.emitData.emit({
			type: "close",
			data: this.viewModel.backupName
		});
	}
}
