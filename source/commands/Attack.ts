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
    constructor() {
        super("attack");

        this.description = "When you're in showdown, attack your opponent using this command.";
    }

    public async exec(message: Message): Promise<any> {
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


        let oldBattleMessage = message.channel.messages.get(battleChannel.battle.message);
        await oldBattleMessage.delete();


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
                    author: {
                        name: `${initiator.displayName} VS ${contender.displayName}`
                    },
                    title: "Showdown",
                    fields: [
                        {
                            name: initiator.displayName,
                            value: `${battleChannel.battle.HP.initiator} **HP**`,
                        },
                        {
                            name: contender.displayName,
                            value: `${battleChannel.battle.HP.contender} **HP**`,
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
