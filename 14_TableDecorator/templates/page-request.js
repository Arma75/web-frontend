const PAGE_REQUEST_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class PageRequest {
    protected int page = 1;
    protected int size = 10;
    protected String sort;

    public int getOffset() {
        return (this.page - 1) * this.size;
    }

    public void setPage(int page) {
        this.page = Math.max(page, 1);
    }
    public void setSize(int size) {
        this.size = Math.max(size, 1);
    }
    public void setSort(String sort) {
        this.sort = sort;
    }
}
`;