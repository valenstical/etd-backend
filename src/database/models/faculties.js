import { commonModel } from './template';

export default (sequelize, DataTypes) => {
  const Faculty = sequelize.define('Faculty', commonModel(DataTypes, sequelize));

  Faculty.associate = (models) => {
    Faculty.belongsTo(models.College, {
      foreignKey: 'collegeId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
  };
  return Faculty;
};
