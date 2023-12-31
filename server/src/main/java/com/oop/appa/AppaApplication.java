package com.oop.appa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.cache.annotation.EnableCaching;


@SpringBootApplication
@EnableCaching
public class AppaApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("spring.datasource.url", dotenv.get("DATABASE_URL"));
		System.setProperty("spring.datasource.username", dotenv.get("DATABASE_USERNAME"));
		System.setProperty("spring.datasource.password", dotenv.get("DATABASE_PASSWORD"));
		System.setProperty("spring.mail.username", dotenv.get("SPRING-MAIL_USERNAME"));
		System.setProperty("sprint.mail.password", dotenv.get("SPRING-MAIL_PASSWORD"));
		System.setProperty("springdoc.swagger-ui.display-request-duration", "true");
		SpringApplication.run(AppaApplication.class, args);
	}

}