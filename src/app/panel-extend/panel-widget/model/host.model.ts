/****基础组件的默认数据和样式*******/
import { uniqueId } from "@ng-public/util";
import { get } from "lodash";
import { WidgetModel } from "./widget.model";

export class HostItemModel {
    public name: string = ""; // 宿主组件的名称
    public component: string = ""; // 宿主组件的组件类型，和Host文件夹里的组件名称一致，便于动态的创建视图
    public icon: string = ""; // 图标
    public uniqueId: number | string; // 根据时间戳产生的唯一的标示ID
    public type: string; // 宿主组件的标志位
    public autoWidget: WidgetModel;

    constructor(data?: HostItemModel) {
        this.icon = get(data, "icon");
        this.component = get(data, "component");
        this.name = get(data, "name");
        this.type = get(data, "type");
        this.autoWidget = new WidgetModel(get(data, "autoWidget"));
        setTimeout(() => {
            this.uniqueId = uniqueId();
        });
    }
}
