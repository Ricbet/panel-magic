import { Injectable } from "@angular/core";

import { NewPageModel, NewGroupModel } from "./model";

@Injectable({
    providedIn: "root",
})
export class PanelCatalogueService {
    // 页面的数据模型
    public newPageModel: NewPageModel = new NewPageModel();
    // 分组的数据模型
    public newGroupModel: NewGroupModel = new NewGroupModel();

    constructor() {}
}
