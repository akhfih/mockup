import axios from 'axios';
import type { GroupBase } from 'react-select';
import type { LoadOptions } from 'react-select-async-paginate';

export interface SearchApiResponse {
    results: { label: string; value: string }[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

export function createLoadOptions<OptionType = { label: string; value: string }>(endpoint: string): LoadOptions<OptionType, GroupBase<OptionType>, { page: number }> {
    return async (inputValue, loadedOptions, additional) => {
        const currentPage = additional && typeof additional.page === 'number' ? additional.page : 1;
        try {
            const response = await axios.get<SearchApiResponse>(endpoint, {
                params: {
                    q: inputValue,
                    page: currentPage,
                    page_size: 10,
                },
            });
            return {
                options: response.data.results as OptionType[],
                hasMore: response.data.pagination.page < response.data.pagination.total_pages,
                additional: {
                    page: (response.data.pagination.page || 1) + 1,
                },
            };
        } catch {
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: 1,
                },
            };
        }
    };
}
