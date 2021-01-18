import { useState } from 'react';

export default function usePagination(data = [], pageSize) {
    const [page, setPage] = useState(1);
    const count = data.length;
    const paginatedData = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    if (paginatedData.length === 0 && page > 1) {
        setPage(page - 1);
    }
    return {
        page,
        setPage,
        data: paginatedData,
        count,
    };
}
