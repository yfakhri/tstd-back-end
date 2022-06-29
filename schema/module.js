const { Module, ModuleTC } = require('../models/modules');

const ModuleQuery = {
  moduleById: ModuleTC.mongooseResolvers.findById(),
  moduleByIds: ModuleTC.mongooseResolvers.findByIds(),
  moduleOne: ModuleTC.mongooseResolvers.findOne(),
  moduleMany: ModuleTC.mongooseResolvers.findMany(),
  moduleCount: ModuleTC.mongooseResolvers.count(),
  moduleConnection: ModuleTC.mongooseResolvers.connection(),
  modulePagination: ModuleTC.mongooseResolvers.pagination(),
};

const ModuleMutation = {
  moduleCreateOne: ModuleTC.mongooseResolvers.createOne(),
  moduleCreateMany: ModuleTC.mongooseResolvers.createMany(),
  moduleUpdateById: ModuleTC.mongooseResolvers.updateById(),
  moduleUpdateOne: ModuleTC.mongooseResolvers.updateOne(),
  moduleUpdateMany: ModuleTC.mongooseResolvers.updateMany(),
  moduleRemoveById: ModuleTC.mongooseResolvers.removeById(),
  moduleRemoveOne: ModuleTC.mongooseResolvers.removeOne(),
  moduleRemoveMany: ModuleTC.mongooseResolvers.removeMany(),
};

module.exports = { Module, ModuleQuery, ModuleMutation };
