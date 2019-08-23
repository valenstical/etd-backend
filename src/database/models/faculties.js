export default (sequelize, DataTypes) => {
  const Faculty = sequelize.define('Faculty', {
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
   * Get a faculty if exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The details if found, null
   */
  Faculty.getDegree = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await Faculty.findOne({
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
  return Faculty;
};
