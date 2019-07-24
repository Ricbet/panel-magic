import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class HttpSealData {
    //api 统一接口 地址
    commonHost: string;
    //文件资源 统一 地址
    fileHost: string;

    constructor() {
        this.commonHost = "";
        this.fileHost = "";
    }
}
