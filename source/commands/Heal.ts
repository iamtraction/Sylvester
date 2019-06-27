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

class Heal extends Command {
    recentHealers: Snowflake[];

    constructor() {
        super("heal");

        this.recentHealers = [];

        this.description = "When you're in showdown, heal yourself using this command. You can heal yourself only once every 15 seconds.";
    }

    public async exec(message: Message): Promise<any> {
        if (this.recentHealers.includes(message.author.id)) return;

        let battleChannel = message.channel as BattleChannel;

        if (!battleChannel.battle || !battleChannel.battle.HP) return;
        if (![ battleChannel.battle.initiator, battleChannel.battle.contender ].includes(message.author.id)) return;


        if (!battleChannel.battle.HP.initiator || !battleChannel.battle.HP.contender) return;


        let healer: "initiator" | "contender" = null;
        if (message.author.id == battleChannel.battle.initiator) healer = "initiator";
        else if (message.author.id == battleChannel.battle.contender) healer = "contender";


        if (battleChannel.battle.HP[healer] > 90) return;

        battleChannel.battle.HP[healer] += 10;


        let initiator = message.guild.members.get(battleChannel.battle.initiator);
        let contender = message.guild.members.get(battleChannel.battle.contender);


        this.recentHealers.push(message.author.id);
        this.client.setTimeout(() => this.recentHealers.splice(this.recentHealers.indexOf(message.author.id), 1), 15000);


        // IDEA: Don't delete old message in case players want to see their battle history.
        // let oldBattleMessage = message.channel.messages.get(battleChannel.battle.message);
        // await oldBattleMessage.delete();


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
                    text: "Use the !attack command to attack your opponent and the !heal command to heal yourself.",
                },
            }
        }) as Message;

        battleChannel.battle.message = battleMessage.id;
    }
}

export = Heal;
