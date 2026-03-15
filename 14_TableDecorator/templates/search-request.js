const SEARCH_REQUEST_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import com.{{teamName}}.{{projectName}}.common.dto.PageRequest;
{{#each importList}}
import {{this}};
{{/each}}

/**
 * {{tableComment}}
 * 
 * @author system
 * @since {{today}}
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "{{tableComment}} 조회 정보")
public class {{tablePascalName}}SearchRequest extends PageRequest {
{{#each targetColumns}}
    /**
     * {{options.comment}}
     */
    @Schema(description = "{{options.comment}}")
    {{#if isLocalDateTime}}
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    {{/if}}
    private {{javaType}} {{fieldName}};
{{/each}}
}`;