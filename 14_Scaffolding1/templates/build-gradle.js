const BUILD_GRADLE_TEMPLATE =
`plugins {
    id 'java'
    id 'org.springframework.boot' version '3.5.9'
    id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.{{teamName}}'
version = '0.0.1-SNAPSHOT'
description = '{{projectDescription}}'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // Swagger (Springdoc OpenAPI)
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9'

    // JDBC
    implementation 'org.springframework.boot:spring-boot-starter-jdbc'
	
	// PostgreSQL driver
    runtimeOnly 'org.postgresql:postgresql'

	// Apache POI - A library for reading or writing Microsoft Excel files
    implementation 'org.apache.poi:poi-ooxml:5.2.3'
    
    // MyBatis
    implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.4'

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // Spring AOP
    implementation 'org.springframework.boot:spring-boot-starter-aop'
}`;