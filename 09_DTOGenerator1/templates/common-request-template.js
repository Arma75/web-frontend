const COMMON_REQUEST_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

{{#if useSwagger}}
import io.swagger.v3.oas.annotations.media.Schema;
{{/if}}
{{#if useLombok}}
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
{{/if}}

{{#if writeComment}}
/**
 * 공통 페이징 요청 DTO
 * 
 * @author system
 * @since {{today}}
 */
{{/if}}
{{#if useLombok}}
@Getter
@ToString
@NoArgsConstructor
{{/if}}
{{#if useSwagger}}
@Schema(description = "페이징 요청 정보")
{{/if}}
public class PageRequest {

    {{#if writeComment}}
    /**
     * 페이지 번호 (1부터 시작)
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "페이지 번호 (1부터 시작)", defaultValue = "1", example = "1")
    {{/if}}
    protected int page = 1;

    {{#if writeComment}}
    /**
     * 페이지당 출력 개수
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "페이지당 출력 개수", defaultValue = "10", example = "10")
    {{/if}}
    protected int size = 10;

    {{#if writeComment}}
    /**
     * 정렬 조건 (필드명,ASC|DESC;필드명,ASC|DESC)
     */
    {{/if}}
    {{#if useSwagger}}
    @Schema(description = "정렬 조건 (필드명,ASC|DESC;필드명,ASC|DESC)", example = "createdAt,DESC;id,ASC")
    {{/if}}
    protected String sort;

    {{#if writeComment}}
    /**
     * 페이지 번호를 설정합니다. 1보다 작은 값이 입력되면 1로 고정됩니다.
     * @param page 페이지 번호
     */
    {{/if}}
    public void setPage(int page) {
        this.page = Math.max(page, 1);
    }
    
    {{#if writeComment}}
    /**
     * 페이지당 출력 개수를 설정합니다. 1보다 작은 값이 입력되면 1로 고정됩니다.
     * @param size 페이지당 개수
     */
    {{/if}}
    public void setSize(int size) {
        this.size = Math.max(size, 1);
    }
    
    {{#if writeComment}}
    /**
     * 정렬 조건을 설정합니다.
     * @param sort 정렬 조건
     */
    {{/if}}
    public void setSort(String sort) {
        this.sort = sort;
    }

    {{#if writeComment}}
    /**
     * DB 조회 시 사용할 Offset 값을 반환합니다.
     * @return 조회 시작 위치 (0부터 시작)
     */
    {{/if}}
    public int getOffset() {
        return (this.page - 1) * this.size;
    }
{{#unless useLombok}}

    {{#if writeComment}}
    /**
     * 현재 페이지 번호를 반환합니다.
     * @return 페이지 번호
     */
    {{/if}}
    public int getPage() {
        return this.page;
    }
    
    {{#if writeComment}}
    /**
     * 페이지당 출력 개수를 반환합니다.
     * @return 페이지당 개수
     */
    {{/if}}
    public int getSize() {
        return this.size;
    }
    
    {{#if writeComment}}
    /**
     * 정렬 조건을 반환합니다.
     * @return 정렬 문자열
     */
    {{/if}}
    public String getSort() {
        return this.sort;
    }

    @Override
    public String toString() {
        return "PageRequest{" +
            "page=" + page + ", " +
            "size=" + size + ", " +
            "sort=" + sort +
            "}";
    }
{{/unless}}
}`;