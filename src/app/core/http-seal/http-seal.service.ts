import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class HttpSealService {
    constructor() {}

    /**
     * 转化get参数
     * @param param
     */
    getParam(param: any): HttpParams {
        let params = new HttpParams();
        Object.keys(param).forEach(key => {
            params = params.set(key, param[key]);
        });
        return params;
    }
}
