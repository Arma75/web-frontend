const DTO_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.dto;

{{#each importList}}
import {{this}};
{{/each}}

{{#if writeComment}}
/**
 * {{tableComment}}
 * 
 * @author system
 * @since {{today}}
 */
{{/if}}
{{#if useLombok}}
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
{{/if}}
{{#if useSwagger}}
@Schema(description = "{{tableComment}} 정보")
{{/if}}
public class {{className}}{{#if isSearchRequest}} extends PageRequest{{/if}} {

{{#each targetColumns}}
    {{#if ../writeComment}}
    /**
     * {{comment}}
     */
    {{/if}}
    {{#if ../useSwagger}}
    @Schema(description = "{{comment}}")
    {{/if}}
    {{#if isLocalTime}}
    @DateTimeFormat(pattern = "HH:mm:ss")
    {{else if isLocalDate}}
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    {{else if isLocalDateTime}}
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    {{/if}}
    private {{javaType}} {{fieldName}};
{{/each}}
{{#unless useLombok}}

    {{#each targetColumns}}
    {{#if ../writeComment}}
    /**
     * {{comment}} 값을 설정합니다.
     * @param {{fieldName}} {{comment}}
     */
    {{/if}}
    public void set{{pascalName}}({{javaType}} {{fieldName}}) {
        this.{{fieldName}} = {{fieldName}};
    }
    {{/each}}

    {{#each targetColumns}}
    {{#if ../writeComment}}
    /**
     * {{comment}} 값을 반환합니다.
     * @return {{comment}}
     */
    {{/if}}
    public {{javaType}} get{{pascalName}}() {
        return this.{{fieldName}};
    }
    {{/each}}

    @Override
    public String toString() {
        return "{{className}}{" +
            {{#each targetColumns}}
            "{{fieldName}}=" + {{fieldName}}{{#unless @last}} + ", " +{{else}} +{{/unless}}
            {{/each}}
            "}";
    }
{{/unless}}
{{#if isSaveRequest}}

    /**
     * DTO 유효성 검증
     * @param isPatch 패치 요청 여부 (true일 경우 필수값 검증 제외)
     */
    public void validate(boolean isPatch) {
        {{#each targetColumns}}
        {{#unless autoIncrease}}
        {{#if notNull}}
        if (!isPatch && ({{fieldName}} == null{{#if isString}} || {{fieldName}}.isBlank(){{/if}})) {
            throw new IllegalArgumentException("{{fieldName}} is required.");
        }
        {{/if}}
        {{#if length}}
        {{#if isString}}
        if ({{fieldName}} != null && {{fieldName}}.length() > {{length}}) {
            throw new IllegalArgumentException("{{fieldName}} length cannot exceed {{length}}.");
        }
        {{/if}}
        {{/if}}
        {{/unless}}
        {{#unless @last}}

        {{/unless}}
        {{/each}}
    }
{{/if}}

}`;