export default (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    memberId: {
      type: DataTypes.STRING,
    },
    plan: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      onUpdate: sequelize.NOW,
    },
  });
  Payment.associate = (models) => {
    Payment.belongsTo(models.Member, {
      foreignKey: 'memberId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
  };
  return Payment;
};
