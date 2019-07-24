import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class MousescrollService {
    public listenMouseScroll$: () => any;

    constructor() {}
}
