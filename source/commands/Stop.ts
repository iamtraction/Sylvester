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

class Stop extends Command {
    constructor() {
        super("stop");

        this.description = "Stop the currently running showdown in the channel.";
        this.userPermissions = [ "MANAGE_GUILD" ];
    }

    public async exec(message: Message): Promise<any> {
        let battleChannel = message.channel as BattleChannel;

        delete battleChannel.battle;

        await message.channel.send({
            embed: {
                color: 15547712,
                title: "Cat Showdown",
                description: "You've stopped the cat showdown running in this channel.",
            },
        });
    }
}

export = Stop;
