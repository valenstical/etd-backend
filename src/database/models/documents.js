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
    degreeId: {
      type: DataTypes.INTEGER,
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
    facultyId: {
      type: DataTypes.INTEGER,
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

  /**
   * Get a document if exist
   * @param {string} column Column to check against
   * @param {string} value Value to lookup
   * @returns {object} The details if found, null
   */
  Document.getDocument = async (column, value) => {
    let result = null;
    try {
      const { dataValues } = await Document.findOne({
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

  Document.associate = (models) => {
    Document.belongsTo(models.Faculty, {
      foreignKey: 'facultyId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
    Document.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      targetKey: 'id',
      onDelete: 'RESTRICT',
    });
    Document.belongsTo(models.Degree, {
      foreignKey: 'degreeId',
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
