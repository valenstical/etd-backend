import { commonModel } from './template';

export default (sequelize, DataTypes) => {
  const Advisor = sequelize.define('Advisor', commonModel(DataTypes, sequelize));

  Advisor.associate = (models) => {
    Advisor.belongsTo(models.College, {
      foreignKey: 'collegeId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
  };
  return Advisor;
};
