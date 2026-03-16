const SERVICE_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.{{teamName}}.{{tableName}}.common.dto.PageResponse;
import com.{{teamName}}.{{tableName}}.{{tableName}}.dto.{{tablePascalName}}SaveRequest;
import com.{{teamName}}.{{tableName}}.{{tableName}}.dto.{{tablePascalName}}Response;
import com.{{teamName}}.{{tableName}}.{{tableName}}.dto.{{tablePascalName}}SearchRequest;

import jakarta.servlet.http.HttpServletResponse;

public interface {{tablePascalName}}Service {
    int create({{tablePascalName}}SaveRequest {{tableName}}SaveRequest);

    int createBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests);

    int uploadExcel(MultipartFile file);

    {{tablePascalName}}Response findById({{#each pkColumns}}{{this.type}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    PageResponse<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{tableName}}SearchRequest);

    void downloadExcel({{tablePascalName}}SearchRequest {{tableName}}SearchRequest, HttpServletResponse response);

    int update({{#each pkColumns}}{{this.type}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableName}}SaveRequest);

    int updateBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests);

    int patch({{#each pkColumns}}{{this.type}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableName}}SaveRequest);

    int patchBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests);

    int unuse({{#each pkColumns}}{{this.type}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int unuseBulk({{#if isSinglePk}}List<{{pkColumns.[0].type}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}});

    int delete({{#each pkColumns}}{{this.type}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});

    int deleteBulk({{#if isSinglePk}}List<{{pkColumns.[0].type}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}});
}`;