package com.oop.appa.config;

import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .components(null)
            .addSecurityItem(new SecurityRequirement().addList("JWT"))
            .components(
                new io.swagger.v3.oas.models.Components()
                    .addSecuritySchemes("JWT",
                        new SecurityScheme()
                            .name("JWT")
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                    )
            );
    }

    // @Bean
    // public GroupedOpenApi publicApi() {
    //     return GroupedOpenApi.builder()
    //         .group("public")
    //         .pathsToMatch("/**")
    //         .build();
    // }

    @Bean
    public OperationCustomizer customize() {
        return (operation, handlerMethod) -> {
            operation.addSecurityItem(new SecurityRequirement().addList("JWT"));
            return operation;
        };
    }
}
