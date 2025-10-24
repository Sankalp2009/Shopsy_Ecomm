class ApiFeature {
  constructor(findQuery, queryString) {
    this.findQuery = findQuery;
    this.queryString = queryString;
  }

  // 🔍 Fast text-based search
  search() {
    const { search } = this.queryString;
    if (search) {
      const trimmed = search.trim();

      // ✅ If text index exists, prefer $text (MUCH faster than regex)
      if (Product.schema?.indexes?.some((idx) => "$**_text" in idx)) {
        this.findQuery = this.findQuery.find({ $text: { $search: trimmed } });
      } else {
        this.findQuery = this.findQuery.find({
          $or: [
            { name: new RegExp(trimmed, "i") },
            { description: new RegExp(trimmed, "i") },
            { category: new RegExp(trimmed, "i") },
            { brand: new RegExp(trimmed, "i") },
          ],
        });
      }
    }
    return this;
  }

  // 🧭 Filtering logic
  filter() {
    const queryObj = { ...this.queryString };
    const excluded = ["page", "sort", "limit", "fields", "search"];
    excluded.forEach((field) => delete queryObj[field]);

    // Multi-category support
    if (queryObj.category) {
      queryObj.category = { $in: [].concat(queryObj.category) };
    }

    // Convert operators
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (m) => `$${m}`
    );

    this.findQuery = this.findQuery.find(JSON.parse(queryStr));
    return this;
  }

  // ↕ Sorting
  sort() {
    const { sort } = this.queryString;
    this.findQuery = sort
      ? this.findQuery.sort(sort.split(",").join(" "))
      : this.findQuery.sort("-createdAt");
    return this;
  }

  // 🎯 Limit visible fields
  limitFields() {
    const { fields } = this.queryString;
    this.findQuery = fields
      ? this.findQuery.select(fields.split(",").join(" "))
      : this.findQuery.select("-__v");
    return this;
  }

  // 📄 Pagination
  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit) || 10);
    const skip = (page - 1) * limit;

    this.findQuery = this.findQuery.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }

  // ⚙️ Execute the built query
  async exec() {
    return this.findQuery.lean().exec();
  }
}

export default ApiFeature;
