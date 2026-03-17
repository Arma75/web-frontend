const RESPONSE_TEMPLATE =
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
@Schema(description = "{{tableDescription}} 응답 정보")
public class {{tablePascalName}}Response {
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
}`;