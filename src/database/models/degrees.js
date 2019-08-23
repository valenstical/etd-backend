export default (sequelize, DataTypes) => {
  const Degree = sequelize.define('Degree', {
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
  });

  /**
   * Get a degree if exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The details if found, null
   */
  Degree.getDegree = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await Degree.findOne({
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
  return Degree;
};
