const PAGE_RESPONSE_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PageResponse<T> {
    private List<T> data;
    private long totalCount;
    private int totalPage;
    private int currentPage;

    public PageResponse(List<T> data, long totalCount, int size, int page) {
        this.data = data;
        this.totalCount = totalCount;
        this.currentPage = page;
        this.totalPage = (int) Math.ceil((double) totalCount / size);
    }

    public List<T> getData() {
        return this.data;
    }
    public long getTotalCount() {
        return this.totalCount;
    }
    public int getTotalPage() {
        return this.totalPage;
    }
    public int getCurrentPage() {
        return this.currentPage;
    }
}
`;