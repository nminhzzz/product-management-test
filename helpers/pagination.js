module.exports = (objectPagination, query, countProducts) => {
  // page hiện tại
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  // tính skip
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  // tổng số trang
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems);

  objectPagination.totalPage = totalPage;

  return objectPagination;
};
