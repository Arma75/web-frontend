const SAVE_REQUEST_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
{{#each importList}}
import {{this}};
{{/each}}

/**
 * {{tableDescription}}
 * 
 * @author system
 * @since {{today}}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "{{tableDescription}} 저장 정보")
public class {{tablePascalName}}SaveRequest {
{{#each columns}}
    /**
     * {{options.comment}}
     */
    @Schema(description = "{{options.comment}}")
    {{#if isLocalDateTime}}
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    {{/if}}
    private {{javaType}} {{fieldName}};
{{/each}}

    /**
     * DTO 유효성 검증
     * @param isPatch 패치 요청 여부 (true일 경우 필수값 검증 제외)
     */
    public void validate(boolean isPatch) {
        {{#each columns}}
            {{#unless options.isAutoIncrement}}
                {{#unless options.nullable}}
        if (!isPatch && ({{fieldName}} == null{{#if isString}} || {{fieldName}}.isBlank(){{/if}})) {
            throw new IllegalArgumentException("{{fieldName}} is required.");
        }
                {{/unless}}

                {{#if options.length}}
                    {{#if isString}}
        if ({{fieldName}} != null && {{fieldName}}.length() > {{options.length}}) {
            throw new IllegalArgumentException("{{fieldName}} length cannot exceed {{options.length}}.");
        }
                    {{/if}}
                {{/if}}
            {{/unless}}
        {{/each}}
    }
}`;