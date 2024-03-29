import { Command } from "tesseract";
import { Message, Snowflake, TextChannel } from "discord.js";

interface IBattle {
    message: Snowflake;
    initiator: Snowflake;
    contender: Snowflake;
    probabilities: {
        initiator: number;
        contender: number;
    },
    cumulativeProbabilities: {
        initiator: number;
        contender: number;
    },
    HP?: {
        initiator: number;
        contender: number;
    },
}

interface BattleChannel extends TextChannel {
    battle: IBattle;
}

class Battle extends Command {
    constructor() {
        super("battle");

        this.description = "Starts a showdown request in the channel. If someone accepts it, you start a battle.";
    }

    public async exec(message: Message): Promise<any> {
        let guildDoc = await this.client.database.models.guild.findOne({
            where: {
                guildID: message.guild.id,
                enabled: true,
            },
        });

        if (!guildDoc) return;


        let battleChannel = message.channel as BattleChannel;

        if (battleChannel.battle && battleChannel.battle.initiator) {
            if (message.author.id === battleChannel.battle.initiator) return;
            if (battleChannel.battle.contender) return;

            battleChannel.battle.contender = message.author.id;


            await this.calculateProbability(battleChannel);


            let initiator = message.guild.members.get(battleChannel.battle.initiator);
            let contender = message.guild.members.get(battleChannel.battle.contender);


            await message.channel.send({
                embed: {
                    color: 15547712,
                    title: "Showdown",
                    description: `**${contender.displayName}** accepted the challenge from **${initiator.displayName}**!`,
                    thumbnail: {
                        url: `https://robohash.org/${contender.id}?set=set4`,
                    },
                    footer: {
                        text: "Showdown will start in a few seconds!"
                    },
                },
            });


            battleChannel.battle.HP = {
                initiator: 100,
                contender: 100,
            };


            let battleMessage = await message.channel.send(`${initiator} **VS** ${contender}`, {
                embed: {
                    color: 15547712,
                    title: "Let the battle begin!",
                    fields: [
                        {
                            name: initiator.displayName,
                            value: " :heart: ".repeat(battleChannel.battle.HP.initiator / 10),
                        },
                        {
                            name: contender.displayName,
                            value: " :heart: ".repeat(battleChannel.battle.HP.contender / 10),
                        },
                    ],
                    footer: {
                        text: "Use the !attack command to attack your opponent and the !heal command to heal yourself.",
                    },
                }
            }) as Message;

            battleChannel.battle.message = battleMessage.id;
        } else {
            battleChannel.battle = {
                message: null,
                initiator: message.author.id,
                contender: null,
                probabilities: {
                    initiator: 0,
                    contender: 0,
                },
                cumulativeProbabilities: {
                    initiator: 0,
                    contender: 0,
                },
            };

            message.channel.send({
                embed: {
                    color: 15547712,
                    title: "Showdown",
                    description: `**${message.member.displayName}** is challenging you to a showdown! To accept the challenge, use the \`${this.client.configurations.prefixes[0]}battle\` command.`,
                    fields: [
                        {
                            name: "Guidelines",
                            value: `**#1** You can use \`${this.client.configurations.prefixes[0]}attack\` to attack your opponents every 5 seconds. Users in higher level with more XP have higher chance of their attacks being successful.\n\n`
                                + `**#2** You can use \`${this.client.configurations.prefixes[0]}heal\` to heal yourself every 15 seconds.\n\n`
                                + `**#3** You'll get 50 XP for participating in the game and completing it to the end. And you'll get another extra 50 XP if you win.\n\n`,
                        },
                        {
                            name: "Accept Challenge",
                            value: `To accept the challenge and start battling, use the \`${this.client.configurations.prefixes[0]}battle\` command.`,
                        },
                    ],
                    thumbnail: {
                        url: `https://robohash.org/${message.author.id}?set=set4`,
                    },
                },
            });
        }
    }

    private async calculateProbability(battleChannel: BattleChannel): Promise<void> {
        await this.client.database.models.member.upsert({
            userID: battleChannel.battle.initiator,
            guildID: battleChannel.guild.id,
        }, {
            where: {
                userID: battleChannel.battle.initiator,
                guildID: battleChannel.guild.id,
            },
        });
        let initiatorDoc = await this.client.database.models.member.findOne({
            where: {
                userID: battleChannel.battle.initiator,
                guildID: battleChannel.guild.id,
            },
        });

        await this.client.database.models.member.upsert({
            userID: battleChannel.battle.contender,
            guildID: battleChannel.guild.id,
        }, {
            where: {
                userID: battleChannel.battle.contender,
                guildID: battleChannel.guild.id,
            },
        });
        let contenderDoc = await this.client.database.models.member.findOne({
            where: {
                userID: battleChannel.battle.contender,
                guildID: battleChannel.guild.id,
            },
        });


        initiatorDoc.dataValues.experiencePoints = parseInt(initiatorDoc.dataValues.experiencePoints);
        initiatorDoc.dataValues.level = parseInt(initiatorDoc.dataValues.level);
        contenderDoc.dataValues.experiencePoints = parseInt(contenderDoc.dataValues.experiencePoints);
        contenderDoc.dataValues.level = parseInt(contenderDoc.dataValues.level);


        battleChannel.battle.probabilities = {
            initiator: 0,
            contender: 0,
        };

        if (initiatorDoc.dataValues.level === contenderDoc.dataValues.level) {
            battleChannel.battle.probabilities.initiator = initiatorDoc.dataValues.experiencePoints / (initiatorDoc.dataValues.experiencePoints + contenderDoc.dataValues.experiencePoints);
            battleChannel.battle.probabilities.contender = contenderDoc.dataValues.experiencePoints / (initiatorDoc.dataValues.experiencePoints + contenderDoc.dataValues.experiencePoints);
        } else {
            battleChannel.battle.probabilities.initiator = initiatorDoc.dataValues.level / (initiatorDoc.dataValues.level + contenderDoc.dataValues.level);
            battleChannel.battle.probabilities.contender = contenderDoc.dataValues.level / (initiatorDoc.dataValues.level + contenderDoc.dataValues.level);
        }

        battleChannel.battle.cumulativeProbabilities = {
            initiator: battleChannel.battle.probabilities.initiator,
            contender: battleChannel.battle.probabilities.initiator + battleChannel.battle.probabilities.contender,
        };
    }
}

export = Battle;
