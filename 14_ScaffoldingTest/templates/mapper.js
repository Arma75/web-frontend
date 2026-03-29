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
    int create({{tablePascalName}}SaveRequest {{tableName}}SaveRequest);

    int createBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests);

    {{tablePascalName}}Response findById({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    List<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{tableName}}SearchRequest);

    long countAll({{tablePascalName}}SearchRequest {{tableName}}SearchRequest);

    int update({{tablePascalName}}SaveRequest {{tableName}}SaveRequest);

    int updateBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests);

    int patch({{tablePascalName}}SaveRequest {{tableName}}SaveRequest);

    int patchBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests);
    {{#if hasLogicalUseColumn}}

    int unuse({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int unuseBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}});
    {{/if}}

    int delete({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int deleteBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}});
}`;