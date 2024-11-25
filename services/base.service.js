class BaseService {
  constructor(model) {
    this.model = model;
    this.query = this.model.find();
  }

  resetFilter() {
    this.query = this.model.find();
    return this;
  }

  searchByField(field, keyword) {
    this.query = this.query.find({
      [field]: { $regex: keyword, $options: "i" },
    });
    return this;
  }

  filterByFields(filterParams) {
    const filter = {};

    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (Array.isArray(value)) {
        filter[key] = { $gte: value[0], $lte: value[1] };
      } else {
        filter[key] = value;
      }
    });

    this.query = this.query.find(filter);
    return this;
  }

  paginate(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
