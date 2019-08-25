import { commonModel } from './template';

export default (sequelize, DataTypes) => {
  const Degree = sequelize.define('Degree', commonModel(DataTypes, sequelize));

  Degree.associate = (models) => {
    Degree.belongsTo(models.College, {
      foreignKey: 'collegeId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
  };
  return Degree;
};
