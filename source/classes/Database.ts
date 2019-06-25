import * as sequelize from "sequelize";

class Database {
    public database: sequelize.Sequelize;

    constructor() {
        this.database = new sequelize.Sequelize({
            dialect: "sqlite",
            storage: "data/sylvester.db",
            logging: false,
        });

        this.model();
    }

    private model() {
        const Guild: any = this.database.define("guild", {
            guildID: {
                type: sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            enabled: {
                type: sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });

        const Member = this.database.define("member", {
            userID: {
                type: sequelize.STRING,
                allowNull: false,
                unique: "member",
            },
            guildID: {
                type: sequelize.STRING,
                allowNull: false,
                unique: "member",
            },
            wins: {
                type: sequelize.TEXT,
                allowNull: false,
                defaultValue: '0',
            },
            losses: {
                type: sequelize.TEXT,
                allowNull: false,
                defaultValue: '0',
            },
            draws: {
                type: sequelize.TEXT,
                allowNull: false,
                defaultValue: '0',
            },
            sylvesterCoins: {
                type: sequelize.TEXT,
                allowNull: false,
                defaultValue: '0',
            },
            experiencePoints: {
                type: sequelize.TEXT,
                allowNull: false,
                defaultValue: '0',
            },
            level: {
                type: sequelize.TEXT,
                allowNull: false,
                defaultValue: '0',
            },
        });

        Guild.hasMany(Member, {
            foreignKey: 'guildID',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        this.database.sync();
    }
}

export default Database;
