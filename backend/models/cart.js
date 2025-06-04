const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cart extends Model {}

  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      as: 'items',
    });
  };

  return Cart;
}; 