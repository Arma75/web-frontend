const LOGGING_AOP_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.aop;

import java.util.HashMap;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
public class ApiLoggingAspect {
    @Around("execution(* com.{{teamName}}.{{projectName}}..controller..*.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        // 소요시간 측정 시작
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        // 현재 요청 정보 추출
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String httpMethod = request.getMethod();
        String uri = request.getRequestURI();
        String methodName = toScreamingSnakeCase(joinPoint.getSignature().getName());

        String[] parameterNames = ((MethodSignature) joinPoint.getSignature()).getParameterNames();
        Object[] args = joinPoint.getArgs();
        Map<String, Object> params = new HashMap<>();
        if (parameterNames != null) {
            for (int i = 0; i < parameterNames.length; i++) {
                params.put(parameterNames[i], args[i]);
            }
        }
        
        // API 시작 로깅
        log.info("[{}] Started. Params: {}", methodName, params);

        try {
            // 실제 비즈니스 로직 실행
            Object result = joinPoint.proceed();
            
            // 성공 로깅
            log.info("[{}] Completed successfully.", methodName);

            return result;
        } catch (Exception e) {
            // 실패 로깅
            log.error("[{}] Failed. Error: {}", methodName, e.getMessage());
            throw e;
        } finally {
            // 소요시간 측정 종료
            stopWatch.stop();
            
            log.info("[API TIMER] {} {} | Method: {} | Duration: {}ms", httpMethod, uri, methodName, stopWatch.getTotalTimeMillis());
        }
    }

    /**
     * camelCase를 ScreamingSnakeCase로 변환
     * @param camelCase
     * @return
     */
    private String toScreamingSnakeCase(String camelCase) {
        if (camelCase == null || camelCase.isEmpty()) {
            return camelCase;
        }

        String regex = "([a-z])([A-Z]+)";
        String replacement = "$1_$2";
        
        return camelCase.replaceAll(regex, replacement).toUpperCase();
    }
}`;