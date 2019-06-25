import { Listener } from "tesseract";
import { Message, Snowflake } from "discord.js";

class MessageListener extends Listener {
    recentCats: Snowflake[];

    constructor() {
        super("message");

        this.recentCats = [];
    }

    public async exec(message: Message): Promise<any> {
        if (message.author.bot) return;

        if (this.recentCats.includes(message.author.id)) return;


        let guildDoc = await this.client.database.models.guild.findOne({
            where: {
                guildID: message.guild.id,
                enabled: true,
            },
        });

        if (!guildDoc) return;


        this.recentCats.push(message.author.id);
        setTimeout(() => this.recentCats.splice(this.recentCats.indexOf(message.author.id), 1), 25 * 1000);


        let [ memberDoc, initialized ] = await this.client.database.models.member.findOrBuild({
            where: {
                userID: message.author.id,
                guildID: message.guild.id,
            },
        });

        if (initialized) await memberDoc.save();


        memberDoc.dataValues.experiencePoints = parseInt(memberDoc.dataValues.experiencePoints);
        memberDoc.dataValues.level = parseInt(memberDoc.dataValues.level);
        memberDoc.dataValues.sylvesterCoins = parseInt(memberDoc.dataValues.sylvesterCoins);

        let calculatedLevel = Math.floor(0.15 * Math.sqrt(memberDoc.dataValues.experiencePoints + 1));

        let hasLevelledUp = calculatedLevel > memberDoc.dataValues.level;


        await this.client.database.models.member.update({
            sylvesterCoins: hasLevelledUp
                ? memberDoc.dataValues.sylvesterCoins + calculatedLevel * 5
                : memberDoc.dataValues.sylvesterCoins,
            experiencePoints: memberDoc.dataValues.experiencePoints + 1,
            level: hasLevelledUp ? calculatedLevel : memberDoc.dataValues.level
        }, {
            where: {
                userID: message.author.id,
                guildID: message.guild.id,
            },
            fields: [ 'sylvesterCoins', 'experiencePoints', 'level' ]
        });
    }
}

export = MessageListener;
