const SERVICE_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.{{teamName}}.{{projectName}}.common.dto.PageResponse;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SaveRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}Response;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SearchRequest;
{{#each pkColumnImportList}}
import {{this}};
{{/each}}

import jakarta.servlet.http.HttpServletResponse;

public interface {{tablePascalName}}Service {
    int create({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest);

    int createBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests);

    int uploadExcel(MultipartFile file);

    {{tablePascalName}}Response findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    PageResponse<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest);

    void downloadExcel({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest, HttpServletResponse response);

    int update({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest);

    int updateBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests);

    int patch({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest);

    int patchBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests);
    {{#if hasLogicalUseColumn}}

    int unuse({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int unuseBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}});
    {{/if}}

    int delete({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int deleteBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}});
}`;