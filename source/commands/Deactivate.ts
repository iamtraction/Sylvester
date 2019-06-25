import { Command } from "tesseract";
import { Message } from "discord.js";

class Deactivate extends Command {
    constructor() {
        super("deactivate");

        this.description = "Deactivates Cat Showdown game mode in the server, removing all member data.";
        this.userPermissions = [ "MANAGE_GUILD" ];
    }

    public async exec(message: Message): Promise<any> {
        await this.client.database.models.guild.destroy({
            where: { guildID: message.guild.id },
        });

        await message.channel.send({
            embed: {
                color: 15547712,
                title: "Cat Showdown",
                description: "You've deactivated Cat Showdown in this server. All the member data has been removed.",
            },
        });
    }
}

export = Deactivate;
