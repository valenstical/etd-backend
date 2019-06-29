import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    sex: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, process.env.SECRET_KEY));
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: null,
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
   * Get a member details if it exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The user details if found, null
   */
  Member.getMember = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await Member.findOne({
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

  Member.associate = (models) => {
    // associations can be defined here
  };
  return Member;
};
