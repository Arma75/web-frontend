const MAPPER_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SaveRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}Response;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SearchRequest;
{{#each pkColumnImportList}}
import {{this}};
{{/each}}

@Mapper
public interface {{tablePascalName}}Mapper {
    int create({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest);

    int createBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests);

    {{tablePascalName}}Response findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    List<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest);

    long countAll({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest);

    int update({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest);

    int updateBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests);

    int patch({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest);

    int patchBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests);
    {{#if hasLogicalUseColumn}}

    int unuse({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int unuseBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}});
    {{/if}}

    int delete({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int deleteBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}});
}`;