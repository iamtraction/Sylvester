import { Command, Snowflake } from "tesseract";
import { Message, TextChannel } from "discord.js";

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

class Attack extends Command {
    recentAttackers: Snowflake[];

    constructor() {
        super("attack");

        this.recentAttackers = [];

        this.description = "When you're in showdown, attack your opponent using this command. You can attack only once every 5 seconds.";
    }

    public async exec(message: Message): Promise<any> {
        if (this.recentAttackers.includes(message.author.id)) return;

        let battleChannel = message.channel as BattleChannel;

        if (!battleChannel.battle || !battleChannel.battle.HP) return;
        if (![ battleChannel.battle.initiator, battleChannel.battle.contender ].includes(message.author.id)) return;


        let attacker: "initiator" | "contender" = null;
        if (message.author.id == battleChannel.battle.initiator) attacker = "initiator";
        else if (message.author.id == battleChannel.battle.contender) attacker = "contender";


        let magicNumber: number = Math.random();

        let attacked: boolean = null;
        if (magicNumber < battleChannel.battle.cumulativeProbabilities["initiator"]) {
            attacked = attacker === "initiator";
        } else if (magicNumber < battleChannel.battle.cumulativeProbabilities["contender"]) {
            attacked = attacker === "contender";
        }


        if (attacked) {
            if (attacker === "initiator") {
                battleChannel.battle.HP.contender -= 10;
            } else if (attacker == "contender") {
                battleChannel.battle.HP.initiator -= 10;
            }
        }


        let initiator = message.guild.members.get(battleChannel.battle.initiator);
        let contender = message.guild.members.get(battleChannel.battle.contender);


        this.recentAttackers.push(message.author.id);
        this.client.setTimeout(() => this.recentAttackers.splice(this.recentAttackers.indexOf(message.author.id), 1), 5000);


        // IDEA: Don't delete old message in case players want to see their battle history.
        // let oldBattleMessage = message.channel.messages.get(battleChannel.battle.message);
        // await oldBattleMessage.delete();


        if (!battleChannel.battle.HP.initiator || !battleChannel.battle.HP.contender) {
            let winner = battleChannel.battle.HP.initiator > battleChannel.battle.HP.contender ? initiator : contender;

            await message.channel.send({
                embed: {
                    color: 15547712,
                    title: "Showdown",
                    description: `**${winner.displayName}** claims victory!`,
                    thumbnail: {
                        url: `https://robohash.org/${winner.id}?set=set4`,
                    },
                    footer: {
                        text: "Congratulations",
                    },
                }
            });

            delete battleChannel.battle;
        } else {
            let battleMessage = await message.channel.send({
                embed: {
                    color: 15547712,
                    title: "Showdown",
                    fields: [
                        {
                            name: initiator.displayName,
                            value: " :heart: ".repeat(battleChannel.battle.HP.initiator / 10)
                                + " :black_heart: ".repeat(10 - battleChannel.battle.HP.initiator / 10),
                        },
                        {
                            name: contender.displayName,
                            value: " :heart: ".repeat(battleChannel.battle.HP.contender / 10)
                                + " :black_heart: ".repeat(10 - battleChannel.battle.HP.contender / 10),
                        },
                    ],
                    footer: {
                        text: "Use the !attack command to attack your opponent.",
                    },
                }
            }) as Message;

            battleChannel.battle.message = battleMessage.id;
        }
    }
}

export = Attack;
