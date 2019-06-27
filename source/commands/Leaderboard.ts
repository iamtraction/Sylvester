import { Command } from "tesseract";
import { Message } from "discord.js";

class Leaderbord extends Command {
    constructor() {
        super("leaderboard");

        this.description = "Shows the showdown champions of the server.";
    }

    public async exec(message: Message): any {
        let memberDocs = await this.client.database.models.member.findAll({
            attributes: [ "userID", "wins", "losses", "experiencePoints", "level" ],
            where: {
                guildID: message.guild.id
            },
            order: [
                [ this.client.database.fn("ABS", this.client.database.col("wins")), "DESC" ],
                [ this.client.database.fn("ABS", this.client.database.col("losses")), "DESC" ],
                [ this.client.database.fn("ABS", this.client.database.col("level")), "DESC" ],
                [ this.client.database.fn("ABS", this.client.database.col("experiencePoints")), "DESC" ],
            ],
            limit: 10
        });

        let profiles = memberDocs.map((member: any) => member.dataValues);


        let fields = [];
        for (let i = 0; i < profiles.length; i++) {
            let user;
            if (message.guild.members.has(profiles[i].userID)) {
                let member = message.guild.members.get(profiles[i].userID);
                user = member.displayName === member.user.username ? `${member.displayName} / ${member.id}` : `${member.displayName} / ${member.user.tag} / ${member.id}`;
            } else {
                user = profiles[i].userID;
            }
            fields.push({
                name: `${i + 1}. ${user}`,
                value: `${profiles[i].wins} Wins • ${profiles[i].losses} Losses`
            });
        }


        await message.channel.send({
            embed: {
                color: 15547712,
                title: "Showdown Leadeboard",
                fields: fields
            }
        });
    }
}

export = Leaderbord;
