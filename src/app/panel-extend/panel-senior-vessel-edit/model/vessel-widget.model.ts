import { VesselStatusCollectionModel } from "./vessel-status-collectionModel";

// 所有状态下的widget组件集合的索引（便于查询和渲染）
export interface IStatusWarehouseCollectionable {
    [key: string]: VesselStatusCollectionModel;
}

export class VesselWidgetModel {
    // 当前状态的唯一标识id
    public currentStatusId: string = "";
    // 存储所有状态下的容器内组件列表的集合(仓库集合)
    public statusWarehouseCollection: VesselStatusCollectionModel[] = [];
    // 当前动态容器组件的名称
    public name: string = "";

    /**
     * 所有状态下的容器内组件列表的索引表
     * 用于快速查找当前状态的下的状态仓库集合（statusWarehouseCollection）
     */
    public repertoryStatusWarehouse: { [key: string]: VesselStatusCollectionModel } = {};

    constructor(data?: VesselWidgetModel) {
        this.setData(data);
    }

    /**
     * 赋值数据
     */
    public setData(data: VesselWidgetModel): void {
        if (data) {
            for (const key in this) {
                if ((<Object>data).hasOwnProperty(key)) {
                    if (key == "statusWarehouseCollection") {
                        let arr = [];
                        if (Array.isArray(data.statusWarehouseCollection)) {
                            data.statusWarehouseCollection.forEach(e => {
                                arr.push(new VesselStatusCollectionModel(e));
                            });
                            const pro = new Promise(res => {
                                this.statusWarehouseCollection = arr;
                                setTimeout(() => res());
                            });
                            pro.then(() => {
                                this.handleRepertoryStatusWarehouse();
                            });
                        }
                    } else {
                        this[key] = (<any>data)[key];
                    }
                }
            }
        }
    }

    /**
     * 新增一个新的状态
     */
    public addNewStatusCollection(statusName: string): void {
        const newStatus = new VesselStatusCollectionModel();
        newStatus.initStatus(statusName);
        this.statusWarehouseCollection = this.statusWarehouseCollection.concat(newStatus);
        this.handleRepertoryStatusWarehouse();
    }

    /**
     * 删除某一个状态
     */
    public delStatusCollection(status: VesselStatusCollectionModel, index: number): void {
        this.statusWarehouseCollection.splice(index, 1);
        if (this.repertoryStatusWarehouse[status.uniqueId]) {
            delete this.repertoryStatusWarehouse[status.uniqueId];
        }
    }

    /**
     * 建立状态仓库索引表
     */
    public handleRepertoryStatusWarehouse(): void {
        if (Array.isArray(this.statusWarehouseCollection)) {
            this.repertoryStatusWarehouse = {};
            this.statusWarehouseCollection.forEach(w => {
                this.repertoryStatusWarehouse[w.uniqueId] = w;
            });
        }
    }
}
