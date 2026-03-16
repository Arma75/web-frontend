const CONTROLLER_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.{{teamName}}.{{projectName}}.common.dto.PageResponse;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SaveRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}Response;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SearchRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.service.{{tablePascalName}}Service;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/{{tableName}}")
public class {{tablePascalName}}Controller {
    private final Logger logger = LoggerFactory.getLogger({{tablePascalName}}Controller.class);
    private final {{tablePascalName}}Service {{tableName}}Service;

    public {{tablePascalName}}Controller({{tablePascalName}}Service {{tableName}}Service) {
        this.{{tableName}}Service = {{tableName}}Service;
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody {{tablePascalName}}SaveRequest {{tableName}}SaveRequest) {
        logger.info("[CREATE] {{tablePascalName}} create started. {{tableName}}SaveRequest: {}", {{tableName}}SaveRequest);

        {{tableName}}SaveRequest.validate(false);

        {{tableName}}Service.create({{tableName}}SaveRequest);

        logger.info("[CREATE] {{tablePascalName}} created successfully.");
        return ResponseEntity.status(201).body("{{tablePascalName}} created successfully.");
    }

    @PostMapping("/bulk")
    public ResponseEntity<Object> createBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests) {
        logger.info("[CREATE_BULK] {{tablePascalName}} create started. {{tableName}}SaveRequests: {}", {{tableName}}SaveRequests);
        for ({{tablePascalName}}SaveRequest {{tableName}}SaveRequest : {{tableName}}SaveRequests) {
            {{tableName}}SaveRequest.validate(false);
        }

        {{tableName}}Service.createBulk({{tableName}}SaveRequests);
        
        logger.info("[CREATE_BULK] {{tablePascalName}} created successfully.");
        return ResponseEntity.status(201).body("Create success");
    }

    @PostMapping(value = "/excel-update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadExcel(@RequestPart("file") MultipartFile file) {
        logger.info("[EXCEL-UPLOAD] Excel file upload started. Filename: {}", file.getOriginalFilename());
        {{tableName}}Service.uploadExcel(file);

        logger.info("[EXCEL-UPLOAD] Excel file uploaded successfully.");
        return ResponseEntity.status(201).body("Create success");
    }
    
    @GetMapping("{{#each pkColumns}}/{{this.fieldName}}{{/each}}")
    public ResponseEntity<{{tablePascalName}}Response> findById({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.type}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        logger.info("[FIND_BY_ID] {{tablePascalName}} search started. id: {}", id);
        {{tablePascalName}}Response {{tableName}}Response = {{tableName}}Service.findById(id);

        logger.info("[FIND_BY_ID] {{tablePascalName}} search complete successfully.");
        return ResponseEntity.ok({{tableName}}Response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<{{tablePascalName}}Response>> findAll({{tablePascalName}}SearchRequest {{tableName}}SearchRequest) {
        logger.info("[FIND_ALL] {{tablePascalName}} search started. {{tableName}}SearchRequest: {}", {{tableName}}SearchRequest);
        PageResponse<{{tablePascalName}}Response> pageResponse = {{tableName}}Service.findAll({{tableName}}SearchRequest);

        logger.info("[FIND_ALL] {{tablePascalName}} search complete successfully.");
        return ResponseEntity.ok(pageResponse);
    }

    @GetMapping("/excel-download")
    public void downloadExcel({{tablePascalName}}SearchRequest {{tableName}}SearchRequest, HttpServletResponse response) {
        logger.info("[EXCEL_DOWNLOAD] Excel file download started. {{tableName}}SearchRequest: {}", {{tableName}}SearchRequest);
        {{tableName}}Service.downloadExcel({{tableName}}SearchRequest, response);
        logger.info("[EXCEL_DOWNLOAD] Excel file downloaded successfully.");
    }

    @PutMapping("{{#each pkColumns}}/{{this.fieldName}}{{/each}}")
    public ResponseEntity<?> update({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.type}} {{this.fieldName}}, {{/each}}@RequestBody {{tablePascalName}}SaveRequest {{tableName}}SaveRequest) {
        logger.info("[UPLOAD] {{tablePascalName}} upload started. id: {}, {{tableName}}SaveRequest: {}", id, {{tableName}}SaveRequest);

        {{tableName}}SaveRequest.validate(false);

        {{tableName}}Service.update(id, {{tableName}}SaveRequest);

        logger.info("[UPLOAD] {{tablePascalName}} uploaded successfully.");
        return ResponseEntity.status(200).body("Update success");
    }

    @PutMapping("/bulk")
    public ResponseEntity<?> updateBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests) {
        logger.info("[UPLOAD_BULK] {{tablePascalName}} upload started. {{tableName}}SaveRequests: {}", {{tableName}}SaveRequests);
        for ({{tablePascalName}}SaveRequest {{tableName}}SaveRequest : {{tableName}}SaveRequests) {
            {{tableName}}SaveRequest.validate(false);
        }
        
        {{tableName}}Service.updateBulk({{tableName}}SaveRequests);

        logger.info("[UPLOAD_BULK] {{tablePascalName}} uploaded successfully.");
        return ResponseEntity.status(200).body("Update success");
    }

    @PatchMapping("{{#each pkColumns}}/{{this.fieldName}}{{/each}}")
    public ResponseEntity<?> patch({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.type}} {{this.fieldName}}, {{/each}}@RequestBody {{tablePascalName}}SaveRequest {{tableName}}SaveRequest) {
        logger.info("[PATCH] {{tablePascalName}} patch started. id: {}, {{tableName}}SaveRequest: {}", id, {{tableName}}SaveRequest);
        {{tableName}}SaveRequest.validate(true);
        
        {{tableName}}Service.patch(id, {{tableName}}SaveRequest);
        
        logger.info("[PATCH] {{tablePascalName}} patched successfully.");
        return ResponseEntity.status(200).body("Patch success");
    }

    @PatchMapping("/bulk")
    public ResponseEntity<?> patchBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests) {
        logger.info("[PATCH_BULK] {{tablePascalName}} patch started. {{tableName}}SaveRequests: {}", {{tableName}}SaveRequests);
        for ({{tablePascalName}}SaveRequest {{tableName}}SaveRequest : {{tableName}}SaveRequests) {
            {{tableName}}SaveRequest.validate(true);
        }

        {{tableName}}Service.patchBulk({{tableName}}SaveRequests);

        logger.info("[PATCH_BULK] {{tablePascalName}} patched successfully.");
        return ResponseEntity.status(200).body("Patch success");
    }

    @PatchMapping("{{#each pkColumns}}/{{this.fieldName}}{{/each}}/unuse")
    public ResponseEntity<?> unuse({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.type}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        logger.info("[UNUSE] {{tablePascalName}} unuse started. id: {}", id);

        {{tableName}}Service.unuse(id);
        
        logger.info("[UNUSE] {{tablePascalName}} unused successfully.");
        return ResponseEntity.status(200).body("Unuse success");
    }

    @PatchMapping("/bulk/unuse")
    public ResponseEntity<?> unuseBulk(@RequestBody {{#if isSinglePk}}List<{{pkColumns.[0].type}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}}) {
        logger.info("[UNUSE_BULK] {{tablePascalName}} unuse started. ids: {}", ids);
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("The 'ids' is required.");
        }

        {{tableName}}Service.unuseBulk(ids);
        
        logger.info("[UNUSE_BULK] {{tablePascalName}} unused successfully.");
        return ResponseEntity.status(200).body("Unuse success");
    }

    @DeleteMapping("{{#each pkColumns}}/{{this.fieldName}}{{/each}}")
    public ResponseEntity<?> delete({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.type}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        logger.info("[DELETE] {{tablePascalName}} delete started. id: {}", id);

        {{tableName}}Service.delete(id);
        
        logger.info("[DELETE] {{tablePascalName}} deleted successfully.");
        return ResponseEntity.status(200).body("Delete success");
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteBulk(@RequestBody {{#if isSinglePk}}List<{{pkColumns.[0].type}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableName}}SaveRequests{{/if}}) {
        logger.info("[DELETE_BULK] {{tablePascalName}} delete started. ids: {}", ids);
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("The 'ids' is required.");
        }

        {{tableName}}Service.deleteBulk(ids);
        
        logger.info("[DELETE_BULK] {{tablePascalName}} deleted successfully.");
        return ResponseEntity.status(200).body("Delete success");
    }
}`;