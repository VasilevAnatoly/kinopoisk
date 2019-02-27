module.exports = (sequelize, type) => {
    return sequelize.define('movie', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        origin_name: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        description: {
            type: type.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        image: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        year: {
            type: type.INTEGER,
        },
        rate: {
            type: type.FLOAT,
            defaultValue: 0.0,
            allowNull: false,
        },
        likes: {
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        dislikes: {
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    });
}