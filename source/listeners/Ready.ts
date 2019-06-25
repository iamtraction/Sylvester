import { Listener } from "tesseract";

class Ready extends Listener {
    constructor() {
        super("ready", { mode: 0x000001 });
    }

    public exec(): any {
        console.log(this.client.user.username + " is now ready to battle!");

        return true;
    }
}

export = Ready;
