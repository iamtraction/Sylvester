import { Command } from "tesseract";
import { Message } from "discord.js";

class Invite extends Command {
    constructor() {
        super("invite");

        this.description = "Shows you the invite links for Sylvester and its Cattery!";
    }

    public exec(message: Message): any {
        message.channel.send({
            embed: {
                color: 15547712,
                fields: [
                    {
                        name: "Invite Sylvester",
                        value: "https://discordapp.com/oauth2/authorize?client_id=593322338917941249&scope=bot&permissions=126016"
                    },
                    {
                        name: "Sylvester's Cattery",
                        value: "https://discord.gg/AEKUQTT"
                    },
                ],
                thumbnail: {
                    url: this.client.user.avatarURL,
                },
            },
        });
    }
}

export = Invite;
