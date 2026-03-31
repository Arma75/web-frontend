const APPLICATION_TEMPLATE =
`package com.{{teamName}}.{{projectName}};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class {{projectPascalName}}Application {
    public static void main(String[] args) {
        SpringApplication.run({{projectPascalName}}Application.class, args);
    }
}
`;