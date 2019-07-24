import { Pipe, PipeTransform } from "@angular/core";

/**
 * 去除引用 用于input 引用传递
 */
@Pipe({ name: "jsonParsePipe" })
export class JsonParsePipe implements PipeTransform {
    transform(value: any) {
        return JSON.parse(JSON.stringify(value));
    }
}
