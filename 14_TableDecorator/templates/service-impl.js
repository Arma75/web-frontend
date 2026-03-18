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

import jakarta.servlet.http.HttpServletResponse;

@Transactional(readOnly = true)
@Service
public class {{tablePascalName}}ServiceImpl implements {{tablePascalName}}Service {
    private final {{tablePascalName}}Mapper {{projectName}}Mapper;

    public {{tablePascalName}}ServiceImpl({{tablePascalName}}Mapper {{projectName}}Mapper) {
        this.{{projectName}}Mapper = {{projectName}}Mapper;
    }

    @Transactional
    @Override
    public int create({{tablePascalName}}SaveRequest {{projectName}}SaveRequest) {
        int createdCount = {{projectName}}Mapper.create({{projectName}}SaveRequest);
        if (createdCount < 1) {
            throw new RuntimeException("Failed to create {{projectName}} record.");
        }

        return createdCount;
    }

    @Transactional
    @Override
    public int createBulk(List<{{tablePascalName}}SaveRequest> {{projectName}}SaveRequests) {
        int createdCount = {{projectName}}Mapper.createBulk({{projectName}}SaveRequests);
        if (createdCount < 1) {
            throw new RuntimeException("Failed to create {{projectName}} record.");
        }

        return createdCount;
    }

    @Transactional
    @Override
    public int uploadExcel(MultipartFile file) {
        List<{{tablePascalName}}SaveRequest> {{projectName}}SaveRequests = ExcelUtil.convertToList(file, 1, {{tablePascalName}}SaveRequest.class);
        for ({{tablePascalName}}SaveRequest {{projectName}}SaveRequest : {{projectName}}SaveRequests) {
            {{projectName}}SaveRequest.validate(false);
        }

        return createBulk({{projectName}}SaveRequests);
    }

    @Override
    public {{tablePascalName}}Response findById({{#each pkColumns}}{{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        return {{projectName}}Mapper.findById({{#each pkColumns}}{{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}});
    }

    @Override
    public PageResponse<{{tablePascalName}}Response> findAll({{tablePascalName}}SearchRequest {{projectName}}SearchRequest) {
        String sort = {{projectName}}SearchRequest.getSort();
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

                List<String> allowedColumns = List.of("ID", "GENRE", "ARTIST", "SONG_TITLE", "USE_YN", "REG_DTM", "UPD_DTM");
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
            useSort.append("ID DESC");
        }

        {{projectName}}SearchRequest.setSort(useSort.toString());

        List<{{tablePascalName}}Response> data = {{projectName}}Mapper.findAll({{projectName}}SearchRequest);
        long totalCount = {{projectName}}Mapper.countAll({{projectName}}SearchRequest);
        
        return new PageResponse<>(data, totalCount, {{projectName}}SearchRequest.getSize(), {{projectName}}SearchRequest.getPage());
    }

    @Override
    public void downloadExcel({{tablePascalName}}SearchRequest {{projectName}}SearchRequest, HttpServletResponse response) {
        PageResponse<{{tablePascalName}}Response> pageResponse = findAll({{projectName}}SearchRequest);
        List<{{tablePascalName}}Response> {{projectName}}Responses = pageResponse.getData();
        String[] headers = {"아이디", "장르", "아티스트", "제목", "사용여부", "등록일시", "수정일시"};
        
        ExcelUtil.download({{projectName}}Responses, "{{tablePascalName}}", headers, response);
    }

    @Transactional
    @Override
    public int update(Long id, {{tablePascalName}}SaveRequest {{projectName}}SaveRequest) {
        {{projectName}}SaveRequest.setId(id);

        int updatedCount = {{projectName}}Mapper.update({{projectName}}SaveRequest);
        if (updatedCount < 1) {
            throw new RuntimeException("Failed to update {{projectName}} record.");
        }

        return updatedCount;
    }

    @Transactional
    @Override
    public int updateBulk(List<{{tablePascalName}}SaveRequest> {{projectName}}SaveRequests) {
        int updatedCount = {{projectName}}Mapper.updateBulk({{projectName}}SaveRequests);
        if (updatedCount < 1) {
            throw new RuntimeException("Failed to update {{projectName}} record.");
        }

        return updatedCount;
    }

    @Transactional
    @Override
    public int patch(Long id, {{tablePascalName}}SaveRequest {{projectName}}SaveRequest) {
        {{projectName}}SaveRequest.setId(id);

        int patchedCount = {{projectName}}Mapper.patch({{projectName}}SaveRequest);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to patch {{projectName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int patchBulk(List<{{tablePascalName}}SaveRequest> {{projectName}}SaveRequests) {
        int patchedCount = {{projectName}}Mapper.patchBulk({{projectName}}SaveRequests);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to patch {{projectName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int unuse(Long id) {
        int patchedCount = {{projectName}}Mapper.unuse(id);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to unuse {{projectName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int unuseBulk(List<Long> ids) {
        int patchedCount = {{projectName}}Mapper.unuseBulk(ids);
        if (patchedCount < 1) {
            throw new RuntimeException("Failed to unuse {{projectName}} record.");
        }
        return patchedCount;
    }

    @Transactional
    @Override
    public int delete(Long id) {
        int deletedCount = {{projectName}}Mapper.delete(id);
        if (deletedCount < 1) {
            throw new RuntimeException("Failed to delete {{projectName}} record.");
        }
        return deletedCount;
    }

    @Transactional
    @Override
    public int deleteBulk(List<Long> ids) {
        int deletedCount = {{projectName}}Mapper.deleteBulk(ids);
        if (deletedCount < 1) {
            throw new RuntimeException("Failed to delete {{projectName}} record.");
        }
        return deletedCount;
    }
}`;