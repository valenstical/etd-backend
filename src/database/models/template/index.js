export const commonModel = (DataTypes, sequelize) => ({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    set(value) {
      this.setDataValue('name', value.toLowerCase());
    },
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
  collegeId: {
    type: DataTypes.INTEGER,
  },
});

export default {};
