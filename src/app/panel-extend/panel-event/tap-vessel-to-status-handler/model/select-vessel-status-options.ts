export class SelectVesselStatusOptions {
    public statusId: string = "";
    public name: string = "";
    constructor(obj: { statusId: string; name: string }) {
        if (obj) {
            this.statusId = obj.statusId;
            this.name = obj.name;
        }
    }
}
