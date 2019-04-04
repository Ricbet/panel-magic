import { Subject } from "rxjs";

// 检测值变化的基类，若子类需要检测他内部的值的所有变化则都继承于该类和该类的valueChange$方法

export class BaseValueChangeClass<T> {
	public readonly valueChange$: Subject<T> = new Subject<T>();

	constructor() {}
}
