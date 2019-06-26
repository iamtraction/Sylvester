import { Command } from "tesseract";
import { Message } from "discord.js";

class Help extends Command {
    constructor() {
        super("help");

        this.description = "Shows you helping information on Sylvester.";
    }

    public exec(message: Message): any {
        message.channel.send({
            embed: {
                color: 15547712,
                title: "Sylvester Help",
                description: "Sylvester makes your server a RPG battleground for Cat Showdowns!\n",
                fields: [
                    {
                        name: "Plot",
                        value: "Every member in the server is represented as a unique Cat with unique physical features. "
                        + "You gain experience and your avatar levels up as you interact and be active in the server. "
                        + "You can challenge other members for a showdown, battle them and compare stats with them. ",
                    },
                    {
                        name: "Goal",
                        value: "The goal of Sylvester is to keep your server active by keeping it entertaining with a game that never gets old. ",
                    },
                    {
                        name: "Step 1. Activate",
                        value: `After you've added Sylvester to your server, use the \`${this.client.configurations.prefixes[0]}activate\` command to activate the RPG. `
                            + "Once activated, you gain experience as you stay active and interact in the server.",
                    },
                    {
                        name: "Step 2. Let the games begin!",
                        value: `You can now start challenging other and accept others' challenges for battles with the \`${this.client.configurations.prefixes[0]}battle\` command.`,
                    },
                ],
            },
        });
    }
}

export = Help;
