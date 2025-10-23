class ApiFeature {
  constructor(findQuery, queryString) {
    this.findQuery = findQuery;
    this.queryString = queryString;
  }

  // 🔍 Search functionality
  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search.trim();
      this.findQuery = this.findQuery.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
          { brand: { $regex: searchQuery, $options: "i" } },
        ],
      });
    }
    return this;
  }

  // 🔍 Filtering logic
  filter() {
    const queryObj = { ...this.queryString };
    
    // Exclude special fields
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Handle category array (for multiple categories)
    if (queryObj.category) {
      const categories = Array.isArray(queryObj.category)
        ? queryObj.category
        : [queryObj.category];
      queryObj.category = { $in: categories };
    }

    // Convert operators (gte, gt, lte, lt) to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.findQuery = this.findQuery.find(JSON.parse(queryStr));
    return this;
  }

  // ↕ Sorting logic
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.findQuery = this.findQuery.sort(sortBy);
    } else {
      this.findQuery = this.findQuery.sort("-createdAt");
    }
    return this;
  }

  // 🎯 Limit visible fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.findQuery = this.findQuery.select(fields);
    } else {
      this.findQuery = this.findQuery.select("-__v");
    }
    return this;
  }

  // 📄 Pagination
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.findQuery = this.findQuery.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;

    return this;
  }

  // ⚙️ Execute the built query
  async exec() {
    return await this.findQuery.lean();
  }
}

export default ApiFeature;