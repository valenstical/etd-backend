import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, process.env.SECRET_KEY));
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
   * Get a User if exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The user details if found, null
   */
  User.getUser = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await User.findOne({
        where: {
          [column]: value,
        },
        attributes: {
          exclude: ['password'],
        },
      });
      result = dataValues;
    } catch (error) {
      // TODO
    }
    return result;
  };

  User.associate = (models) => {
    // associations can be defined here
  };
  return User;
};
