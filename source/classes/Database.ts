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
        this.database.define("guild", {
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

        this.database.define("member", {
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

        this.database.sync();
    }
}

export default Database;
