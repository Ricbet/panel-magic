import { Injectable } from "@angular/core";

@Injectable()
export class DirectiveService {
	// 全局的鼠标点击函数
	public listenDocumentClick: any;

	constructor() {}
}
