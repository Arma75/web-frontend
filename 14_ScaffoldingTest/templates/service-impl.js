const SERVICE_IMPL_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.{{teamName}}.{{projectName}}.common.dto.PageResponse;
import com.{{teamName}}.{{projectName}}.common.utils.ExcelUtil;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SaveRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}Response;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SearchRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.mapper.{{tablePascalName}}Mapper;
{{#each pkColumnImportList}}
import {{this}};
{{/each}}

import jakarta.servlet.http.HttpServletResponse;

@Transactional(readOnly = true)
@Service
public class {{tablePascalName}}ServiceImpl implements {{tablePascalName}}Service {
    private final {{tablePascalName}}Mapper {{tableName}}Mapper;

    public {{tablePascalName}}ServiceImpl({{tablePascalName}}Mapper {{tableName}}Mapper) {
        this.{{tableName}}Mapper = {{tableName}}Mapper;
    }

    @Transactional
    @Override
    public int create({{tablePascalName}}SaveRequest {{tableName}}SaveRequest) {
        int createdCount = {{tableName}}Mapper.create({{tableName}}SaveRequest);
        if (createdCount < 1) {
            throw new RuntimeException("Failed to create {{tablePascalName}} record.");
        }

        return createdCount;
    }

    @Transactional
    @Override
    public int createBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests) {
        int createdCount = {{tableName}}Mapper.createBulk({{tableName}}SaveRequests);
        if (createdCount < 1) {
            throw new RuntimeException("Failed to create {{tablePascalName}} record.");
        }

        return createdCount;
    }

    @Transactional
    @Override
    public int uploadExcel(MultipartFile file) {
        List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests = ExcelUtil.convertToList(file, 1, {{tablePascalName}}SaveRequest.class);
        for ({{tablePascalName}}SaveRequest {{tableName}}SaveRequest : {{tableName}}SaveRequests) {
            {{tableName}}SaveRequest.validate(false);
        }

        return createBulk({{tableName}}SaveRequests);
    }

    @Override
    public {{tablePascalName}}Response findById({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        return {{tableName}}Mapper.findById({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
    }

    @Override
    public PageResponse<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{tableName}}SearchRequest) {
        String sort = {{tableName}}SearchRequest.getSort();
        StringBuilder useSort = new StringBuilder();
        if (sort != null && !sort.isBlank()) {
            String[] orders = sort.split(";");
            for (int i = 0; i < orders.length; i++) {
                String[] tokens = orders[i].split(",");
                if (tokens.length < 2) {
                    continue;
                }
                String column = tokens[0];
                String direction = tokens[1];

                List<String> allowedColumns = List.of({{#each columns}}"{{this.options.name}}"{{#unless @last}}, {{/unless}}{{/each}});
                if (!allowedColumns.contains(column.toUpperCase())) {
                    throw new IllegalArgumentException("Invalid sort parameter.");
                }
                if (!"ASC".equalsIgnoreCase(direction) && !"DESC".equalsIgnoreCase(direction)) {
                    throw new IllegalArgumentException("Invalid sort parameter.");
                }

                if (i > 0) {
                    useSort.append(", ");
                }
                useSort.append(column + " " + direction);
            }
        } else {
            useSort.append("{{pkColumns.[0].options.name}} DESC");
        }

        {{tableName}}SearchRequest.setSort(useSort.toString());

        List<{{tablePascalName}}Response> data = {{tableName}}Mapper.findAll({{tableName}}SearchRequest);
        long totalCount = {{tableName}}Mapper.countAll({{tableName}}SearchRequest);
        
        return new PageResponse<>(data, totalCount, {{tableName}}SearchRequest.getSize(), {{tableName}}SearchRequest.getPage());
    }

    @Override
    public void downloadExcel({{tablePascalName}}SearchRequest {{tableName}}SearchRequest, HttpServletResponse response) {
        PageResponse<{{tablePascalName}}Response> pageResponse = findAll({{tableName}}SearchRequest);
        List<{{tablePascalName}}Response> {{tableName}}Responses = pageResponse.getData();
        String[] headers = { {{#each columns}}"{{this.options.name}}"{{#unless @last}}, {{/unless}}{{/each}} };
        
        ExcelUtil.download({{tableName}}Responses, "{{tablePascalName}}", headers, response);
    }

    @Transactional
    @Override
    public int update({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableName}}SaveRequest) {
        {{tableName}}SaveRequest.setId(id);

        int updatedCount = {{tableName}}Mapper.update({{tableName}}SaveRequest);
        if (updatedCount < 1) {
            throw new RuntimeException("Failed to update {{tableName}} record.");
        }

        return updatedCount;
    }

    @Transactional
    @Override
    public int updateBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests) {
        int updatedCount = {{tableName}}Mapper.updateBulk({{tableName}}SaveRequests);
        if (updatedCount < 1) {
            throw new RuntimeException("Failed to update {{tableName}} record.");
        }

        return updatedCount;
    }

    @Transactional
    @Override
    public int patch({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableName}}SaveRequest) {
        {{#each pkColumns}}
        {{../tableName}}SaveRequest.set{{this.fieldPascalName}}({{this.fieldName}});
        {{/each}}

        int patchedCount = {{tableName}}Mapper.patch({{tableName}}SaveRequest);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to patch {{tableName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int patchBulk(List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests) {
        int patchedCount = {{tableName}}Mapper.patchBulk({{tableName}}SaveRequests);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to patch {{tableName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int unuse({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        int patchedCount = {{tableName}}Mapper.unuse({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to unuse {{tableName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int unuseBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}}) {
        int patchedCount = {{tableName}}Mapper.unuseBulk({{#if isSinglePk}}{{pkColumns.[0].fieldName}}s{{else}}{{tableCamelName}}SaveRequests{{/if}});
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to unuse {{tableName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int delete({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        int deletedCount = {{tableName}}Mapper.delete({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
        if (deletedCount < 1) {
            throw new RuntimeException("Failed to delete {{tableName}} record.");
        }
        return deletedCount;
    }

    @Transactional
    @Override
    public int deleteBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}}) {
        int deletedCount = {{tableName}}Mapper.deleteBulk({{#if isSinglePk}}{{pkColumns.[0].fieldName}}s{{else}}{{tableCamelName}}SaveRequests{{/if}});
        if (deletedCount < 1) {
            throw new RuntimeException("Failed to delete {{tableName}} record.");
        }
        return deletedCount;
    }
}`;