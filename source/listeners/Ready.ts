import { Listener } from "tesseract";
import Database from "../classes/Database";

class Ready extends Listener {
    constructor() {
        super("ready", { mode: 0x000001 });
    }

    public exec(): any {
        const DB = new Database();

        Object.defineProperty(this.client, "database", {
            value: DB.database,
            writable: false,
        });

        console.log(this.client.user.username + " is now ready to battle!");

        return true;
    }
}

export = Ready;
