const COMMON_RESPONSE_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

import java.util.List;
{{#if useLombok}}
import lombok.Data;
import lombok.NoArgsConstructor;
{{/if}}

{{#if writeComment}}
/**
 * 공통 페이징 응답 DTO
 * 
 * @param <T> 데이터 목록의 타입
 * @author system
 * @since {{today}}
 */
{{/if}}
{{#if useLombok}}
@Data
@NoArgsConstructor
{{/if}}
{{#if useSwagger}}
@Schema(description = "페이징 응답 정보")
{{/if}}
public class PageResponse<T> {

    {{#if writeComment}}
    /**
     * 데이터 목록
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "데이터 목록")
    {{/if}}
    private List<T> data;

    {{#if writeComment}}
    /**
     * 전체 데이터 개수
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "전체 데이터 개수", example = "100")
    {{/if}}
    private long totalCount;

    {{#if writeComment}}
    /**
     * 전체 데이터 수
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "전체 페이지 수", example = "10")
    {{/if}}
    private int totalPage;

    {{#if writeComment}}
    /**
     * 현재 페이지 번호
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "현재 페이지 번호", example = "1")
    {{/if}}
    private int currentPage;

    {{#if writeComment}}
    /**
     * PageResponse 생성자
     * @param data 현재 페이지의 데이터 목록
     * @param totalCount 전체 데이터 개수
     * @param size 페이지당 출력 개수 (전체 페이지 계산용)
     * @param page 현재 페이지 번호
     */
    {{/if}}
    public PageResponse(List<T> data, long totalCount, int size, int page) {
        this.data = data;
        this.totalCount = totalCount;
        this.currentPage = page;
        this.totalPage = (int) Math.ceil((double) totalCount / size);
    }

{{#unless useLombok}}
    {{#if writeComment}}
    /**
     * 데이터 목록을 반환합니다.
     * @return 데이터 목록
     */
    {{/if}}
    public List<T> getData() {
        return this.data;
    }
    
    {{#if writeComment}}
    /**
     * 전체 데이터 개수를 반환합니다.
     * @return 전체 데이터 개수
     */
    {{/if}}
    public long getTotalCount() {
        return this.totalCount;
    }
    
    {{#if writeComment}}
    /**
     * 전체 페이지 수를 반환합니다.
     * @return 전체 페이지 수
     */
    {{/if}}
    public int getTotalPage() {
        return this.totalPage;
    }
    
    {{#if writeComment}}
    /**
     * 현재 페이지 번호를 반환합니다.
     * @return 현재 페이지 번호
     */
    {{/if}}
    public int getCurrentPage() {
        return this.currentPage;
    }
    
{{/unless}}
}`;