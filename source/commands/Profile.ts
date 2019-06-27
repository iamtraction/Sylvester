import { Command } from "tesseract";
import { Message } from "discord.js";

class Profile extends Command {
    constructor() {
        super("profile");

        this.description = "Shows your Cat profile and showdown stats!";
    }

    public async exec(message: Message): Promise<any> {
        let memberDoc = await this.client.database.models.member.findOne({
            where: {
                userID: message.author.id,
                guildID: message.guild.id,
            },
        });

        if (!memberDoc) return;

        await message.channel.send({
            embed: {
                color: 15547712,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.avatarURL,
                },
                description: "Participate in the chat, collect food items, and battle with your friends to improve your stats!",
                thumbnail: {
                    url: `https://robohash.org/${message.author.id}?set=set4`
                },
                fields: [
                    {
                        name: "Wins",
                        value: memberDoc.dataValues.wins,
                        inline: true,
                    },
                    {
                        name: "Losses",
                        value: memberDoc.dataValues.losses,
                        inline: true,
                    },
                    // {
                    //     name: "Draws",
                    //     value: memberDoc.dataValues.draws,
                    //     inline: true,
                    // },
                    {
                        name: "Level",
                        value: memberDoc.dataValues.level,
                        inline: true,
                    },
                    {
                        name: "XP",
                        value: memberDoc.dataValues.experiencePoints,
                        inline: true,
                    },
                    // {
                    //     name: "SylCoins",
                    //     value: memberDoc.dataValues.sylvesterCoins,
                    //     inline: true,
                    // },
                ],
            },
        });
    }
}

export = Profile;
