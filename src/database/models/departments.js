export default (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
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

  /**
   * Get a department if exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The details if found, null
   */
  Department.getDepartment = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await Department.findOne({
        where: {
          [column]: value,
        },
      });
      result = dataValues;
    } catch (error) {
      // TODO
    }
    return result;
  };

  Department.associate = (models) => {
    Department.belongsTo(models.Faculty, {
      foreignKey: 'facultyId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
    Department.belongsTo(models.College, {
      foreignKey: 'collegeId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
  };
  return Department;
};
