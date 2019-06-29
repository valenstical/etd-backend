export default (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    founded: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    contact: {
      type: DataTypes.JSON,
    },
    location: {
      type: DataTypes.JSON,
    },
    details: {
      type: DataTypes.STRING,
    },
    amenities: {
      type: DataTypes.JSON,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    cover: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    gallery: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
      onUpdate: sequelize.NOW,
    },
  });

  School.associate = (models) => {
    School.belongsTo(models.Member, {
      foreignKey: 'memberId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
  };
  return School;
};
