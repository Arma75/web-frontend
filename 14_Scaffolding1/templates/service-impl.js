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
{{#if hasBcryptColumn}}
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
{{/if}}

import jakarta.servlet.http.HttpServletResponse;

@Transactional(readOnly = true)
@Service
public class {{tablePascalName}}ServiceImpl implements {{tablePascalName}}Service {
    private final {{tablePascalName}}Mapper {{tableCamelName}}Mapper;
    {{#if hasBcryptColumn}}
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    {{/if}}

    public {{tablePascalName}}ServiceImpl({{tablePascalName}}Mapper {{tableCamelName}}Mapper{{#if hasBcryptColumn}}, BCryptPasswordEncoder bCryptPasswordEncoder{{/if}}) {
        this.{{tableCamelName}}Mapper = {{tableCamelName}}Mapper;
        {{#if hasBcryptColumn}}
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        {{/if}}
    }

    @Transactional
    @Override
    public int create({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        {{#if hasBcryptColumn}}
        encodeBcryptFields({{tableCamelName}}SaveRequest);

        {{/if}}
        int createdCount = {{tableCamelName}}Mapper.create({{tableCamelName}}SaveRequest);
        if (createdCount < 1) {
            throw new RuntimeException("Failed to create {{tablePascalName}} record.");
        }

        return createdCount;
    }

    @Transactional
    @Override
    public int createBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        {{#if hasBcryptColumn}}
        if ({{tableCamelName}}SaveRequests != null) {
            for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
                encodeBcryptFields({{tableCamelName}}SaveRequest);
            }
        }

        {{/if}}
        int createdCount = {{tableCamelName}}Mapper.createBulk({{tableCamelName}}SaveRequests);
        if (createdCount < 1) {
            throw new RuntimeException("Failed to create {{tablePascalName}} record.");
        }

        return createdCount;
    }

    @Transactional
    @Override
    public int uploadExcel(MultipartFile file) {
        List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests = ExcelUtil.convertToList(file, 1, {{tablePascalName}}SaveRequest.class);
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(false);
        }

        return createBulk({{tableCamelName}}SaveRequests);
    }

    @Override
    public {{tablePascalName}}Response findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        return {{tableCamelName}}Mapper.findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
    }

    @Override
    public PageResponse<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest) {
        long totalCount = {{tableCamelName}}Mapper.countAll({{tableCamelName}}SearchRequest);
        int size = {{tableCamelName}}SearchRequest.getSize();
        int totalPage = size > 0? (int) Math.ceil((double) totalCount / size) : 0;
        int requestedPage = {{tableCamelName}}SearchRequest.getPage();

        if (totalPage > 0 && requestedPage > totalPage) {
            {{tableCamelName}}SearchRequest.setPage(totalPage);
        }
        
        String sort = {{tableCamelName}}SearchRequest.getSort();
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

                List<String> allowedColumns = List.of({{#each columns}}"{{this.name}}"{{#unless @last}}, {{/unless}}{{/each}});
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
            {{#if hasSortColumn}}
            {{#each sortColumns}}
            useSort.append("{{this.name}} ASC");
            {{/each}}
            {{else}}
            useSort.append("{{pkColumns.[0].name}} DESC");
            {{/if}}
        }

        {{tableCamelName}}SearchRequest.setSort(useSort.toString());

        List<{{tablePascalName}}Response> data = {{tableCamelName}}Mapper.findAll({{tableCamelName}}SearchRequest);
        
        return new PageResponse<>(data, totalCount, {{tableCamelName}}SearchRequest.getSize(), {{tableCamelName}}SearchRequest.getPage());
    }

    @Override
    public void downloadExcel({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest, HttpServletResponse response) {
        PageResponse<{{tablePascalName}}Response> pageResponse = findAll({{tableCamelName}}SearchRequest);
        List<{{tablePascalName}}Response> {{tableCamelName}}Responses = pageResponse.getData();
        String[] headers = { {{#each columns}}"{{this.name}}"{{#unless @last}}, {{/unless}}{{/each}} };
        
        ExcelUtil.download({{tableCamelName}}Responses, "{{tablePascalName}}", headers, response);
    }

    @Transactional
    @Override
    public int update({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        {{#if hasBcryptColumn}}
        encodeBcryptFields({{tableCamelName}}SaveRequest);
        
        {{/if}}
        int updatedCount = {{tableCamelName}}Mapper.update({{tableCamelName}}SaveRequest);
        if (updatedCount < 1) {
            throw new RuntimeException("Failed to update {{tableCamelName}} record.");
        }

        return updatedCount;
    }

    @Transactional
    @Override
    public int updateBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        {{#if hasBcryptColumn}}
        if ({{tableCamelName}}SaveRequests != null) {
            for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
                encodeBcryptFields({{tableCamelName}}SaveRequest);
            }
        }

        {{/if}}
        int updatedCount = {{tableCamelName}}Mapper.updateBulk({{tableCamelName}}SaveRequests);
        if (updatedCount < 1) {
            throw new RuntimeException("Failed to update {{tableCamelName}} record.");
        }

        return updatedCount;
    }

    @Transactional
    @Override
    public int patch({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}, {{/each}}{{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        {{#if hasBcryptColumn}}
        encodeBcryptFields({{tableCamelName}}SaveRequest);
        
        {{/if}}
        int patchedCount = {{tableCamelName}}Mapper.patch({{tableCamelName}}SaveRequest);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to patch {{tableCamelName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int patchBulk(List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        {{#if hasBcryptColumn}}
        if ({{tableCamelName}}SaveRequests != null) {
            for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
                encodeBcryptFields({{tableCamelName}}SaveRequest);
            }
        }

        {{/if}}
        int patchedCount = {{tableCamelName}}Mapper.patchBulk({{tableCamelName}}SaveRequests);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to patch {{tableCamelName}} record.");
        }
        return patchedCount;
    }
    {{#if hasLogicalUseColumn}}

    @Transactional
    @Override
    public int unuse({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        int patchedCount = {{tableCamelName}}Mapper.unuse({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to unuse {{tableCamelName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int unuseBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}}) {
        int patchedCount = {{tableCamelName}}Mapper.unuseBulk({{#if isSinglePk}}{{pkColumns.[0].fieldName}}s{{else}}{{tableCamelName}}SaveRequests{{/if}});
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to unuse {{tableCamelName}} record.");
        }
        return patchedCount;
    }
    {{/if}}

    @Transactional
    @Override
    public int delete({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        int deletedCount = {{tableCamelName}}Mapper.delete({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
        if (deletedCount < 1) {
            throw new RuntimeException("Failed to delete {{tableCamelName}} record.");
        }
        return deletedCount;
    }

    @Transactional
    @Override
    public int deleteBulk({{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}}) {
        int deletedCount = {{tableCamelName}}Mapper.deleteBulk({{#if isSinglePk}}{{pkColumns.[0].fieldName}}s{{else}}{{tableCamelName}}SaveRequests{{/if}});
        if (deletedCount < 1) {
            throw new RuntimeException("Failed to delete {{tableCamelName}} record.");
        }
        return deletedCount;
    }
    {{#if hasBcryptColumn}}

    private void encodeBcryptFields({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        if ({{tableCamelName}}SaveRequest == null) {
            return;
        }
        
        {{#each bcryptColumns}}
        if ({{../tableCamelName}}SaveRequest.get{{this.fieldPascalName}}() != null && !{{../tableCamelName}}SaveRequest.get{{this.fieldPascalName}}().isBlank()) {
            {{../tableCamelName}}SaveRequest.set{{this.fieldPascalName}}(bCryptPasswordEncoder.encode({{../tableCamelName}}SaveRequest.get{{this.fieldPascalName}}()));
        }
        {{#unless @last}}
        
        {{/unless}}
        {{/each}}
    }
    {{/if}}
}`;