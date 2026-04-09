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
{{#each pkColumnImportList}}
import {{this}};
{{/each}}

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/{{tableName}}")
public class {{tablePascalName}}Controller {
    private final Logger logger = LoggerFactory.getLogger({{tablePascalName}}Controller.class);
    private final {{tablePascalName}}Service {{tableCamelName}}Service;

    public {{tablePascalName}}Controller({{tablePascalName}}Service {{tableCamelName}}Service) {
        this.{{tableCamelName}}Service = {{tableCamelName}}Service;
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody {{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        logger.info("[CREATE] {{tablePascalName}} create started. {{tableCamelName}}SaveRequest: {}", {{tableCamelName}}SaveRequest);

        {{tableCamelName}}SaveRequest.validate(false);

        {{tableCamelName}}Service.create({{tableCamelName}}SaveRequest);

        logger.info("[CREATE] {{tablePascalName}} created successfully.");
        return ResponseEntity.status(201).body("{{tablePascalName}} created successfully.");
    }

    @PostMapping("/bulk")
    public ResponseEntity<Object> createBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        logger.info("[CREATE_BULK] {{tablePascalName}} create started. {{tableCamelName}}SaveRequests: {}", {{tableCamelName}}SaveRequests);
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(false);
        }

        {{tableCamelName}}Service.createBulk({{tableCamelName}}SaveRequests);
        
        logger.info("[CREATE_BULK] {{tablePascalName}} created successfully.");
        return ResponseEntity.status(201).body("Create success");
    }

    @PostMapping(value = "/excel-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadExcel(@RequestPart("file") MultipartFile file) {
        logger.info("[EXCEL-UPLOAD] Excel file upload started. Filename: {}", file.getOriginalFilename());
        {{tableCamelName}}Service.uploadExcel(file);

        logger.info("[EXCEL-UPLOAD] Excel file uploaded successfully.");
        return ResponseEntity.status(201).body("Create success");
    }
    
    @GetMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<{{tablePascalName}}Response> findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        logger.info("[FIND_BY_ID] {{tablePascalName}} search started. {{#each pkColumns}}{{this.fieldName}}{{/each}}: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}});
        {{tablePascalName}}Response {{tableCamelName}}Response = {{tableCamelName}}Service.findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}{{this.fieldName}}{{/each}});

        logger.info("[FIND_BY_ID] {{tablePascalName}} search complete successfully.");
        return ResponseEntity.ok({{tableCamelName}}Response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<{{tablePascalName}}Response>> findAll({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest) {
        logger.info("[FIND_ALL] {{tablePascalName}} search started. {{tableCamelName}}SearchRequest: {}", {{tableCamelName}}SearchRequest);
        PageResponse<{{tablePascalName}}Response> pageResponse = {{tableCamelName}}Service.findAll({{tableCamelName}}SearchRequest);

        logger.info("[FIND_ALL] {{tablePascalName}} search complete successfully.");
        return ResponseEntity.ok(pageResponse);
    }

    @GetMapping("/excel-download")
    public void downloadExcel({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest, HttpServletResponse response) {
        logger.info("[EXCEL_DOWNLOAD] Excel file download started. {{tableCamelName}}SearchRequest: {}", {{tableCamelName}}SearchRequest);
        {{tableCamelName}}Service.downloadExcel({{tableCamelName}}SearchRequest, response);
        logger.info("[EXCEL_DOWNLOAD] Excel file downloaded successfully.");
    }

    @PutMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<?> update({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}, {{/each}}@RequestBody {{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        logger.info("[UPLOAD] {{tablePascalName}} upload started. {{#each pkColumns}}{{this.fieldName}}{{/each}}: {}, {{tableCamelName}}SaveRequest: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}}, {{tableCamelName}}SaveRequest);
        {{#each pkColumns}}
        {{../tableCamelName}}SaveRequest.set{{this.fieldPascalName}}({{this.fieldName}});
        {{/each}}
        {{tableCamelName}}SaveRequest.validate(false);

        {{tableCamelName}}Service.update({{#each pkColumns}}{{this.fieldName}}{{/each}}, {{tableCamelName}}SaveRequest);

        logger.info("[UPLOAD] {{tablePascalName}} uploaded successfully.");
        return ResponseEntity.status(200).body("Update success");
    }

    @PutMapping("/bulk")
    public ResponseEntity<?> updateBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        logger.info("[UPLOAD_BULK] {{tablePascalName}} upload started. {{tableCamelName}}SaveRequests: {}", {{tableCamelName}}SaveRequests);
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(false);
        }
        
        {{tableCamelName}}Service.updateBulk({{tableCamelName}}SaveRequests);

        logger.info("[UPLOAD_BULK] {{tablePascalName}} uploaded successfully.");
        return ResponseEntity.status(200).body("Update success");
    }

    @PatchMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<?> patch({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}, {{/each}}@RequestBody {{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        logger.info("[PATCH] {{tablePascalName}} patch started. {{#each pkColumns}}{{this.fieldName}}{{/each}}: {}, {{tableCamelName}}SaveRequest: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}}, {{tableCamelName}}SaveRequest);
        {{#each pkColumns}}
        {{../tableCamelName}}SaveRequest.set{{this.fieldPascalName}}({{this.fieldName}});
        {{/each}}
        {{tableCamelName}}SaveRequest.validate(true);
        
        {{tableCamelName}}Service.patch({{#each pkColumns}}{{this.fieldName}}{{/each}}, {{tableCamelName}}SaveRequest);
        
        logger.info("[PATCH] {{tablePascalName}} patched successfully.");
        return ResponseEntity.status(200).body("Patch success");
    }

    @PatchMapping("/bulk")
    public ResponseEntity<?> patchBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        logger.info("[PATCH_BULK] {{tablePascalName}} patch started. {{tableCamelName}}SaveRequests: {}", {{tableCamelName}}SaveRequests);
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(true);
        }

        {{tableCamelName}}Service.patchBulk({{tableCamelName}}SaveRequests);

        logger.info("[PATCH_BULK] {{tablePascalName}} patched successfully.");
        return ResponseEntity.status(200).body("Patch success");
    }
    {{#if hasLogicalUseColumn}}

    @PatchMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }/unuse")
    public ResponseEntity<?> unuse({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        logger.info("[UNUSE] {{tablePascalName}} unuse started. {{#each pkColumns}}{{this.fieldName}}{{/each}}: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}});

        {{tableCamelName}}Service.unuse({{#each pkColumns}}{{this.fieldName}}{{/each}});
        
        logger.info("[UNUSE] {{tablePascalName}} unused successfully.");
        return ResponseEntity.status(200).body("Unuse success");
    }

    @PatchMapping("/bulk/unuse")
    public ResponseEntity<?> unuseBulk(@RequestBody {{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}}) {
        logger.info("[UNUSE_BULK] {{tablePascalName}} unuse started. {{#each pkColumns}}{{this.fieldName}}{{/each}}s: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}}s);
        if ({{#each pkColumns}}{{this.fieldName}}{{/each}}s == null || {{#each pkColumns}}{{this.fieldName}}{{/each}}s.isEmpty()) {
            throw new IllegalArgumentException("The '{{#each pkColumns}}{{this.fieldName}}{{/each}}s' is required.");
        }

        {{tableCamelName}}Service.unuseBulk({{#each pkColumns}}{{this.fieldName}}{{/each}}s);
        
        logger.info("[UNUSE_BULK] {{tablePascalName}} unused successfully.");
        return ResponseEntity.status(200).body("Unuse success");
    }
    {{/if}}

    @DeleteMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<?> delete({{#each pkColumns}}@PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        logger.info("[DELETE] {{tablePascalName}} delete started. {{#each pkColumns}}{{this.fieldName}}{{/each}}: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}});

        {{tableCamelName}}Service.delete({{#each pkColumns}}{{this.fieldName}}{{/each}});
        
        logger.info("[DELETE] {{tablePascalName}} deleted successfully.");
        return ResponseEntity.status(200).body("Delete success");
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteBulk(@RequestBody {{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}}) {
        logger.info("[DELETE_BULK] {{tablePascalName}} delete started. {{#each pkColumns}}{{this.fieldName}}{{/each}}s: {}", {{#each pkColumns}}{{this.fieldName}}{{/each}}s);
        if ({{#each pkColumns}}{{this.fieldName}}{{/each}}s == null || {{#each pkColumns}}{{this.fieldName}}{{/each}}s.isEmpty()) {
            throw new IllegalArgumentException("The '{{#each pkColumns}}{{this.fieldName}}{{/each}}s' is required.");
        }

        {{tableCamelName}}Service.deleteBulk({{#each pkColumns}}{{this.fieldName}}{{/each}}s);
        
        logger.info("[DELETE_BULK] {{tablePascalName}} deleted successfully.");
        return ResponseEntity.status(200).body("Delete success");
    }
}`;