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

            // TODO: Announce winner.
        } else {
            battleChannel.battle = {
                initiator: message.author.id,
                contender: null,
            };

            message.channel.send({
                embed: {
                    color: 15547712,
                    title: "Showdown",
                    description: `${message.member.displayName} is challenging you to a showdown! To accept the challenge, use the \`${this.client.configurations.prefixes[0]}battle\` command.`,
                },
            });
        }
    }

    private async battle(battleChannel: BattleChannel): Promise<Snowflake> {
        return null;
    }
}

export = Battle;
