export class RouterPageOption {
    public router: string = "";
    public name: string = "";
    public isCata: boolean = false;
    constructor(obj: { [key: string]: any }) {
        if (obj) {
            this.router = obj.router;
            this.name = obj.name;
            this.isCata = obj.isCata;
        }
    }
}
