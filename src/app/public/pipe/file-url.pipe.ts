import { Pipe, PipeTransform } from "@angular/core";

import { environment } from "../../../environments/environment";

// 文件类型  用于本地与线上都能正常显示
type fileFlag = "normal" | "upload";

@Pipe({ name: "fileUrlPipe" })
export class FileUrlPipe implements PipeTransform {
    transform(value: string, flag: fileFlag = "normal") {
        let result: string = value;
        if (!environment.production) {
            // 上线
            if (flag == "normal") {
                return (result = value ? value : "/assets/image/default.png");
            }
            if (flag == "upload") {
                return (result = value ? value : "/assets/image/default.png");
            }
        } else {
            // 调试 （资源用本地，upload用远程）
            if (flag == "normal") {
                return (result = value ? value : "assets/image/default.png");
            }
            if (flag == "upload") {
                return (result = value ? value : "assets/image/default.png");
            }
        }
    }
}
