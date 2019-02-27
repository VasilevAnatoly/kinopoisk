module.exports = (sequelize, type) => {
    return sequelize.define('comment', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        comment: {
            type: type.TEXT,
            allowNull: false,
            defaultValue: ""
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
        }
    });
}