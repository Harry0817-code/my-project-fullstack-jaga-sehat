import { useMemo } from "react";

export const usePagination = (
  listArray,
  itemsPerPage,
  currentPage
) => {
  return useMemo(() => {
    const totalPages = Math.ceil(listArray.length / itemsPerPage);
    const safePage = Math.min(currentPage, totalPages || 1);
    const startIndex = (safePage - 1) * itemsPerPage;
    const resultPages = listArray.slice(startIndex, startIndex + itemsPerPage)
    return { resultPages, totalPages};
  }, [listArray, currentPage, itemsPerPage]);
};