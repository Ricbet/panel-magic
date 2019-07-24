import { WidgetModel } from "app/panel-extend/panel-widget/model/widget.model";
import { isObject } from "lodash";

interface ICustomFeatureable {
    title: string;
    name: string;
    // 是否显示底部导航
    isHasTabbar: boolean;
    // 是否是首页
    isHomePage: boolean;
    // 当前页面背景色
    bgColor: string;
    // 导航头部字体颜色
    navFrontColor: string;
    // 导航条背景颜色
    navBgColor: string;
    // 当前页面的高度
    pageHeight: number;
}

interface IAppDataObjectable {
    router: string;
    eles: Array<WidgetModel>;
    customfeature: ICustomFeatureable;
}

export class AppDataObjectModel implements IAppDataObjectable {
    // 页面路由
    public router: string;
    // 该页面的所有组件数据
    public eles: Array<WidgetModel>;
    // 该页面的信息，包括标题和名称
    public customfeature: ICustomFeatureable;

    constructor(data?: IAppDataObjectable) {
        this.initData();
        if (isObject(data)) this.setData(data);
    }

    public initData(): void {
        this.router = "";
        this.eles = [];
        this.customfeature = {
            title: "",
            name: "",
            isHasTabbar: false,
            bgColor: "#ffffff",
            isHomePage: false,
            navBgColor: "#000000",
            navFrontColor: "#ffffff",
            pageHeight: 736,
        };
    }

    public setData(data: IAppDataObjectable): void {
        if ((<Object>data).hasOwnProperty("router")) this.router = data.router;
        if ((<Object>data).hasOwnProperty("eles")) this.eles = data.eles;
        if ((<Object>data).hasOwnProperty("customfeature")) this.customfeature = data.customfeature;
    }

    // 赋值每一个页面项的customfeature数据配置
    public setCustomfeatureData(keys: keyof ICustomFeatureable, value: number | string | boolean): void {
        (<Object>this.customfeature)[keys] = value;
    }
}
