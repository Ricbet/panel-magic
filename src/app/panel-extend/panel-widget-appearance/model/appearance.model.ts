import { BehaviorSubject } from "rxjs";

/**
 * 外观设置面板
 */
export class AppearanceModel {
    public left: number = 210;
    public top: number = 70;
    public height: number = 240;

    public zIndex: number = 102;

    public isShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {}

    public get styleContent(): { [key: string]: string } {
        return {
            left: `${this.left}px`,
            top: `${this.top}px`,
            height: `${this.height}px`,
            "z-index": `${this.zIndex}`,
        };
    }
}
