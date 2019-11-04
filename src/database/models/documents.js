export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    views: {
      type: DataTypes.INTEGER,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    abstract: {
      type: DataTypes.STRING,
    },
    advisors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    downloads: {
      type: DataTypes.INTEGER,
    },
    subject: {
      type: DataTypes.STRING,
    },
    matNumber: {
      type: DataTypes.STRING,
    },
    departmentId: {
      type: DataTypes.INTEGER,
    },
    graduationYear: {
      type: DataTypes.INTEGER,
    },
    submissionYear: {
      type: DataTypes.INTEGER,
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
  Document.associate = (models) => {
    Document.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });

    Document.belongsTo(models.College, {
      foreignKey: 'collegeId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
  };
  return Document;
};
