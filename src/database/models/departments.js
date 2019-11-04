import { commonModel } from './template';

export default (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', commonModel(DataTypes, sequelize));

  Department.associate = (models) => {
    Department.belongsTo(models.College, {
      foreignKey: 'collegeId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
  };
  return Department;
};
