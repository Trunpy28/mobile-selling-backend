export function apiFeatures(query, queryString) {
    let modifiedQuery = query;

    const filter = () => {
        const queryObj = { ...queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        modifiedQuery = modifiedQuery.find(JSON.parse(queryStr));
        return apiFeatures;
    };

    const sort = () => {
        if (queryString.sort) {
            const sortBy = queryString.sort.split(',').join(' ');
            modifiedQuery = modifiedQuery.sort(sortBy);
        } else {
            modifiedQuery = modifiedQuery.sort('-createdAt');
        }
        return apiFeatures;
    };

    const limitFields = () => {
        if (queryString.fields) {
            const fields = queryString.fields.split(',').join(' ');
            modifiedQuery = modifiedQuery.select(fields);
        } else {
            modifiedQuery = modifiedQuery.select('-__v');
        }
        return apiFeatures;
    };

    const paginate = () => {
        const page = queryString.page * 1 || 1;
        const limit = queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        modifiedQuery = modifiedQuery.skip(skip).limit(limit);
        return apiFeatures;
    };

    return {
        query: modifiedQuery,
        filter,
        sort,
        limitFields,
        paginate
    };
}
