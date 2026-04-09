const PAGE_RESPONSE_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

import java.io.Serializable;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(description = "페이징 응답 정보")
public class PageResponse<T> implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "실제 데이터 목록")
    private List<T> data;
    
    @Schema(description = "페이지당 출력 개수", example = "10")
    private int size;
    
    @Schema(description = "전체 데이터 개수", example = "145")
    private long totalCount;
    
    @Schema(description = "전체 페이지 수", example = "15")
    private int totalPage;

    @Schema(description = "현재 페이지 번호", example = "1")
    private int currentPage;

    public PageResponse(List<T> data, long totalCount, int size, int page) {
        this.data = data;
        this.size = size;
        this.totalCount = totalCount;
        this.currentPage = page;

        if (totalCount <= 0 || size <= 0) {
            this.totalPage = 0;
            this.currentPage = 0;
        } else {
            this.totalPage = (int) Math.ceil((double) totalCount / size);
            if (this.currentPage > this.totalPage) {
                this.currentPage = this.totalPage;
            }
        }
    }
}`;