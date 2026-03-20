const APPLICATION_PROPERTIES_TEMPLATE =
`# [Project Configuration]
# 앱의 고유 식별자입니다.
spring.application.name={{projectName}}

# [Database Initialization]
# 앱 실행 시 schema.sql/data.sql을 자동으로 실행할지 결정합니다. 
# 'always'로 설정하면 테이블 생성 과정을 자동화할 수 있어 초기 구축이 편리합니다.
spring.sql.init.mode=always

# [Database Connection (PostgreSQL)]
# DB 접속 정보를 지정입니다.
# prepareThreshold=0은 PostgreSQL 드라이버의 캐싱 관련 오류를 방지합니다.
spring.datasource.url=\${DB_URL}?prepareThreshold=0
spring.datasource.username=\${DB_USERNAME}
spring.datasource.password=\${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# [MyBatis Settings]
# SQL이 담긴 XML 파일의 위치를 지정합니다. 
# 미설정 시 매퍼 인터페이스와 매칭되는 XML을 찾지 못해 'BindingException'이 발생합니다.
mybatis.mapper-locations=classpath:mapper/**/*.xml

# DB의 snake_case(USER_NAME)를 Java의 camelCase(userName)로 자동 매칭합니다.
# 미설정 시 컬럼명과 필드명이 정확히 일치하지 않으면 데이터가 null로 들어옵니다.
mybatis.configuration.map-underscore-to-camel-case=true

# XML에서 DTO 클래스를 참조할 때 패키지 경로를 생략하고 클래스명만 쓸 수 있게 해줍니다.
# 미설정 시 XML의 resultType 등에 모든 패키지 경로(com.xxx...)를 다 적어야 해서 오타 확률이 높아집니다.
mybatis.type-aliases-package=com.{{teamName}}.{{projectName}}.{{tableName}}.dto

# [Logging]
# 실행되는 SQL 쿼리와 파라미터를 콘솔에 출력합니다.
logging.level.com.{{teamName}}.{{projectName}}.{{tableName}}.mapper=DEBUG

# [JSON Formatting (Jackson)]
# 응답 데이터 중 null인 필드는 JSON 결과에서 아예 제외합니다.
spring.jackson.default-property-inclusion=non_null
# 응답 JSON을 보기 좋게 들여쓰기합니다.
spring.jackson.serialization.indent_output=true

# [File Upload (Multipart)]
# 파일 업로드 시 개별 파일 및 전체 요청의 최대 용량을 제한합니다.
# 미설정 시 기본값(보통 1MB)이 매우 작아 엑셀 업로드나 이미지 전송 시 용량 초과 에러가 발생합니다.
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# [Swagger / SpringDoc]
# OpenAPI 3.0 규격을 명시하여 문서 생성의 안정성을 높입니다.
# 미설정 시 일부 환경에서 Swagger UI가 엔드포인트를 찾지 못하고 빈 화면이 뜰 수 있습니다.
springdoc.api-docs.version=openapi_3_0
# API 문서 데이터(JSON)와 UI 페이지의 접속 경로를 지정합니다.
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
# API 목록을 알파벳 순으로 정렬하여 가독성을 높입니다.
springdoc.swagger-ui.operations-sorter=alpha`;