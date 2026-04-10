const PAGE_REQUEST_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
@Schema(description = "페이징 및 정렬 요청 정보")
public class PageRequest {
    /**
     * 페이지 번호
     */
    @Schema(description = "페이지 번호 (1부터 시작) (default: 1)", defaultValue = "1")
    protected int page = 1;

    /**
     * 페이지당 데이터 개수
     */
    @Schema(description = "페이지당 출력 데이터 개수 (default: 10)", defaultValue = "10")
    protected int size = 10;

    /**
     * 정렬 조건
     */
    @Schema(description = "정렬 조건 (example: cd,asc;nm,desc)")
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
}`;