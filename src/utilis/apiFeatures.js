class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  pagination() {
    const page = this.queryString.page || 1;
    if (page < 1) page = 1;
    const limit = 2;
    let skip = (page - 1) * limit;

    this.mongooseQuery.skip(skip).limit(2);
    this.page = page;

    return this;
  }

  filter() {
    let exludeQuery = ["page", "sort", "search", "select"];

    let filterQuery = { ...queryString };

    exludeQuery.forEach((e) => delete filterQuery[e]);

    this.mongooseQuery.find(filterQuery);
  }

  sort() {
    this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "));
  }

  select() {
    this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "));
  }

  search() {
    this.mongooseQuery.find({
      $or: [
        { title: { $regex: this.queryString.search, $options: "i" } },
        { desc: { $regex: this.queryString.search, $options: "i" } },
      ],
    });
  }
}

export default ApiFeatures;
