module.exports = (sequelize, type) => {
    return sequelize.define('date_rate', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        position: {
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        movieId: {
            type: type.INTEGER,
            references: 'movie',
            referencesKey: 'id',
            allowNull: false
        },
        dateId: {
            type: type.INTEGER,
            references: 'date',
            referencesKey: 'id',
            allowNull: false
        },
    });
}