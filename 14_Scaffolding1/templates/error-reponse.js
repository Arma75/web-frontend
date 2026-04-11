const ERROR_RESPONSE_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.dto;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    private final LocalDateTime timestamp;
    private final int status;
    private final String error;
    private final String message;

    public static ErrorResponse of(HttpStatus status, String message) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .build();
    }
}`;