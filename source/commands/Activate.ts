import { Command } from "tesseract";
import { Message } from "discord.js";

class Activate extends Command {
    constructor() {
        super("activate");

        this.description = "Activates Cat Showdown game mode in the server, so that members can now start playing the RPG.";
        this.userPermissions = [ "MANAGE_GUILD" ];
    }

    public async exec(message: Message): Promise<any> {
        await this.client.database.models.guild.upsert({
            guildID: message.guild.id,
            enabled: true,
        }, {
            where: { guildID: message.guild.id },
        });

        await message.channel.send({
            embed: {
                color: 15547712,
                title: "Cat Showdown",
                description: "You've activated Cat Showdown in this server. Start battling!",
            },
        });
    }
}

export = Activate;
