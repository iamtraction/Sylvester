import { Command } from "tesseract";
import { Message, Snowflake, TextChannel } from "discord.js";

interface IBattle {
    initiator: Snowflake;
    contender: Snowflake;
}

interface BattleChannel extends TextChannel {
    battle: IBattle;
}

class Battle extends Command {
    constructor() {
        super("battle");

        this.description = "Shows you the available commands of Sylvester.";
    }

    public async exec(message: Message): Promise<any> {
        let battleChannel = message.channel as BattleChannel;

        if (battleChannel.battle && battleChannel.battle.initiator) {
            if (message.author.id === battleChannel.battle.initiator) return;
            if (battleChannel.battle.contender) return;

            battleChannel.battle.contender = message.author.id;

            let winner = await this.battle(battleChannel);

            message.channel.send({
                embed: {
                    color: 15547712,
                    title: ":confetti_ball: Congratulations :confetti_ball:",
                    description: `<@${winner}> wins the showdown!`,
                    thumbnail: {
                        url: `https://robohash.org/${winner}?set=set4`,
                    },
                },
            });
        } else {
            battleChannel.battle = {
                initiator: message.author.id,
                contender: null,
            };

            message.channel.send({
                embed: {
                    color: 15547712,
                    title: "Showdown",
                    description: `**${message.member.displayName}** is challenging you to a showdown! To accept the challenge, use the \`${this.client.configurations.prefixes[0]}battle\` command.`,
                    thumbnail: {
                        url: `https://robohash.org/${message.author.id}?set=set4`,
                    },
                },
            });
        }
    }

    private async battle(battleChannel: BattleChannel): Promise<Snowflake> {
        let initiatorDoc = await this.client.database.models.member.findOne({
            where: {
                userID: battleChannel.battle.initiator,
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


        let winningProbability = {
            initiator: 0,
            contender: 0,
        };

        if (initiatorDoc.dataValues.level === contenderDoc.dataValues.level) {
            winningProbability.initiator = initiatorDoc.dataValues.experiencePoints / (initiatorDoc.dataValues.experiencePoints + contenderDoc.dataValues.experiencePoints);
            winningProbability.contender = contenderDoc.dataValues.experiencePoints / (initiatorDoc.dataValues.experiencePoints + contenderDoc.dataValues.experiencePoints);
        } else {
            winningProbability.initiator = initiatorDoc.dataValues.level / (initiatorDoc.dataValues.level + contenderDoc.dataValues.level);
            winningProbability.contender = contenderDoc.dataValues.level / (initiatorDoc.dataValues.level + contenderDoc.dataValues.level);
        }

        let winningCumulativeProbability = {
            initiator: winningProbability.initiator,
            contender: winningProbability.initiator + winningProbability.contender,
        };


        let magicNumber: number = Math.random();

        let winner: Snowflake = null;
        if (magicNumber < winningCumulativeProbability.initiator) {
            winner = battleChannel.battle.initiator;
        } else if (magicNumber < winningCumulativeProbability.contender) {
            winner = battleChannel.battle.initiator;
        }


        return winner;
    }
}

export = Battle;
