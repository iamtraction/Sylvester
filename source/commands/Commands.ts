import { Command } from "tesseract";
import { Message } from "discord.js";

class Commands extends Command {
    constructor() {
        super("commands");

        this.description = "Shows you the available commands of Sylvester.";
    }

    public exec(message: Message): any {
        let commands = this.manager.modules.map((command: Command) => ({
            name: this.client.configurations.prefixes[0] + command.name,
            value: command.description,
        }));

        message.channel.send({
            embed: {
                color: 15547712,
                title: "Sylvester Commands",
                description: "Commands you can use with Sylvester.",
                fields: commands,
                thumbnail: {
                    url: this.client.user.avatarURL,
                },
            },
        });
    }
}

export = Commands;
