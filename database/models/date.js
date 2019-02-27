module.exports = (sequelize, type) => {
    return sequelize.define('date', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: type.DATEONLY,
            allowNull: false,
        }
    });
}