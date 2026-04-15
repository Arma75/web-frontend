const CONTROLLER_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.{{tableName}}.controller;

import java.util.List;

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
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}Response;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SaveRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.dto.{{tablePascalName}}SearchRequest;
import com.{{teamName}}.{{projectName}}.{{tableName}}.service.{{tablePascalName}}Service;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
{{#each pkColumnImportList}}
import {{this}};
{{/each}}

@RestController
@RequestMapping("/{{tableName}}")
@Tag(name = "{{tablePascalName}} API", description = "{{tableDescription}} 관리 API입니다.")
public class {{tablePascalName}}Controller {
    private final {{tablePascalName}}Service {{tableCamelName}}Service;

    public {{tablePascalName}}Controller({{tablePascalName}}Service {{tableCamelName}}Service) {
        this.{{tableCamelName}}Service = {{tableCamelName}}Service;
    }

    @Operation(summary = "{{tablePascalName}} 등록", description = "새로운 {{tablePascalName}}를 등록합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "등록 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody {{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        {{tableCamelName}}SaveRequest.validate(false);

        {{tableCamelName}}Service.create({{tableCamelName}}SaveRequest);

        return ResponseEntity.status(201).body("{{tablePascalName}} created successfully.");
    }

    @Operation(summary = "{{tablePascalName}} 일괄 등록", description = "새로운 {{tablePascalName}}를 일괄 등록합니다. 리스트 중 하나라도 검증에 실패하면 일괄 등록이 취소됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "등록 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PostMapping("/bulk")
    public ResponseEntity<Object> createBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(false);
        }

        {{tableCamelName}}Service.createBulk({{tableCamelName}}SaveRequests);
        
        return ResponseEntity.status(201).body("Create success");
    }

    @Operation(summary = "엑셀 업로드", description = "엑셀 파일을 분석하여 {{tablePascalName}}를 일괄 등록합니다. 리스트 중 하나라도 검증에 실패하면 일괄 등록이 취소됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "등록 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패"),
        @ApiResponse(responseCode = "415", description = "지원하지 않는 파일 형식")
    })
    @PostMapping(value = "/excel-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadExcel(@Parameter(description = "업로드할 엑셀 파일 (*.xlsx)", required = true) @RequestPart("file") MultipartFile file) {
        {{tableCamelName}}Service.uploadExcel(file);

        return ResponseEntity.status(201).body("Create success");
    }
    
    @Operation(summary = "{{tablePascalName}} 상세 조회", description = "{{tablePascalName}}를 상세 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 코드")
    })
    @GetMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<{{tablePascalName}}Response> findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}@Parameter(description = "{{this.comment}}") @PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        {{tablePascalName}}Response {{tableCamelName}}Response = {{tableCamelName}}Service.findBy{{#each pkColumns}}{{this.fieldPascalName}}{{/each}}({{#each pkColumns}}{{this.fieldName}}{{/each}});

        return ResponseEntity.ok({{tableCamelName}}Response);
    }

    @Operation(summary = "{{tablePascalName}} 목록 조회", description = "조건에 맞는 {{tablePascalName}} 목록을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @GetMapping
    public ResponseEntity<PageResponse<{{tablePascalName}}Response>> findAll({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest) {
        PageResponse<{{tablePascalName}}Response> pageResponse = {{tableCamelName}}Service.findAll({{tableCamelName}}SearchRequest);

        return ResponseEntity.ok(pageResponse);
    }

    @Operation(summary = "엑셀 다운로드", description = "조건에 맞는 {{tablePascalName}} 목록을 엑셀 파일로 다운로드합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "다운로드 성공", content = @Content(mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @GetMapping("/excel-download")
    public void downloadExcel({{tablePascalName}}SearchRequest {{tableCamelName}}SearchRequest, HttpServletResponse response) {
        {{tableCamelName}}Service.downloadExcel({{tableCamelName}}SearchRequest, response);
    }

    @Operation(summary = "{{tablePascalName}} 수정", description = "{{tablePascalName}}의 전체 필드를 갱신합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수정 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PutMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<?> update({{#each pkColumns}}@Parameter(description = "{{this.comment}}") @PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}, {{/each}}@RequestBody {{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        {{#each pkColumns}}
        {{../tableCamelName}}SaveRequest.set{{this.fieldPascalName}}({{this.fieldName}});
        {{/each}}
        {{tableCamelName}}SaveRequest.validate(false);

        {{tableCamelName}}Service.update({{#each pkColumns}}{{this.fieldName}}{{/each}}, {{tableCamelName}}SaveRequest);

        return ResponseEntity.status(200).body("Update success");
    }

    @Operation(summary = "{{tablePascalName}} 일괄 수정", description = "{{tablePascalName}}의 전체 필드를 일괄 갱신합니다. 리스트 중 하나라도 검증에 실패하면 일괄 수정이 취소됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수정 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PutMapping("/bulk")
    public ResponseEntity<?> updateBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(false);
        }
        
        {{tableCamelName}}Service.updateBulk({{tableCamelName}}SaveRequests);

        return ResponseEntity.status(200).body("Update success");
    }

    @Operation(summary = "{{tablePascalName}} 패치", description = "{{tablePascalName}}의 부분 필드를 갱신합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "패치 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PatchMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<?> patch({{#each pkColumns}}@Parameter(description = "{{this.comment}}") @PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}, {{/each}}@RequestBody {{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest) {
        {{#each pkColumns}}
        {{../tableCamelName}}SaveRequest.set{{this.fieldPascalName}}({{this.fieldName}});
        {{/each}}
        {{tableCamelName}}SaveRequest.validate(true);
        
        {{tableCamelName}}Service.patch({{#each pkColumns}}{{this.fieldName}}{{/each}}, {{tableCamelName}}SaveRequest);
        
        return ResponseEntity.status(200).body("Patch success");
    }

    @Operation(summary = "{{tablePascalName}} 일괄 패치", description = "{{tablePascalName}}의 부분 필드를 일괄 갱신합니다. 리스트 중 하나라도 검증에 실패하면 일괄 패치가 취소됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "패치 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PatchMapping("/bulk")
    public ResponseEntity<?> patchBulk(@RequestBody List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests) {
        for ({{tablePascalName}}SaveRequest {{tableCamelName}}SaveRequest : {{tableCamelName}}SaveRequests) {
            {{tableCamelName}}SaveRequest.validate(true);
        }

        {{tableCamelName}}Service.patchBulk({{tableCamelName}}SaveRequests);

        return ResponseEntity.status(200).body("Patch success");
    }
    {{#if hasLogicalUseColumn}}

    @Operation(summary = "{{tablePascalName}} 미사용 처리", description = "{{tablePascalName}}의 사용 여부를 'N'으로 변경합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "처리 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PatchMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }/unuse")
    public ResponseEntity<?> unuse({{#each pkColumns}}@Parameter(description = "{{this.comment}}") @PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        {{tableCamelName}}Service.unuse({{#each pkColumns}}{{this.fieldName}}{{/each}});
        
        return ResponseEntity.status(200).body("Unuse success");
    }

    @Operation(summary = "{{tablePascalName}} 일괄 미사용 처리", description = "{{tablePascalName}}의 사용 여부를 'N'으로 일괄 변경합니다. 리스트 중 하나라도 검증에 실패하면 일괄 미사용 처리가 취소됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "처리 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @PatchMapping("/bulk/unuse")
    public ResponseEntity<?> unuseBulk(@RequestBody {{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}}) {
        if ({{#each pkColumns}}{{this.fieldName}}{{/each}}s == null || {{#each pkColumns}}{{this.fieldName}}{{/each}}s.isEmpty()) {
            throw new IllegalArgumentException("The '{{#each pkColumns}}{{this.fieldName}}{{/each}}s' is required.");
        }

        {{tableCamelName}}Service.unuseBulk({{#each pkColumns}}{{this.fieldName}}{{/each}}s);
        
        return ResponseEntity.status(200).body("Unuse success");
    }
    {{/if}}

    @Operation(summary = "{{tablePascalName}} 삭제", description = "{{tablePascalName}}를 DB에서 물리적으로 삭제합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "삭제 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @DeleteMapping("/{ {{~#each pkColumns}}{{this.fieldName}}{{/each~}} }")
    public ResponseEntity<?> delete({{#each pkColumns}}@Parameter(description = "{{this.comment}}") @PathVariable("{{this.fieldName}}") {{this.javaType}} {{this.fieldName}}{{#unless @last}}, {{/unless}}{{/each}}) {
        {{tableCamelName}}Service.delete({{#each pkColumns}}{{this.fieldName}}{{/each}});
        
        return ResponseEntity.status(200).body("Delete success");
    }

    @Operation(summary = "{{tablePascalName}} 일괄 삭제", description = "{{tablePascalName}}를 DB에서 물리적으로 일괄 삭제합니다. 리스트 중 하나라도 검증에 실패하면 일괄 삭제가 취소됩니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "삭제 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패")
    })
    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteBulk(@RequestBody {{#if isSinglePk}}List<{{pkColumns.[0].javaType}}> {{pkColumns.[0].fieldName}}s{{else}}List<{{tablePascalName}}SaveRequest> {{tableCamelName}}SaveRequests{{/if}}) {
        if ({{#each pkColumns}}{{this.fieldName}}{{/each}}s == null || {{#each pkColumns}}{{this.fieldName}}{{/each}}s.isEmpty()) {
            throw new IllegalArgumentException("The '{{#each pkColumns}}{{this.fieldName}}{{/each}}s' is required.");
        }

        {{tableCamelName}}Service.deleteBulk({{#each pkColumns}}{{this.fieldName}}{{/each}}s);
        
        return ResponseEntity.status(200).body("Delete success");
    }
}`;