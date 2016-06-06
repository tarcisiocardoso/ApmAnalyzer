package br.com.xyx.apmanalyzer.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApmAnalyzerApplication {

	public static String ROOT = "src/main/resources/static/web/upload";
	
	public static void main(String[] args) {
		SpringApplication.run(ApmAnalyzerApplication.class, args);
	}
}