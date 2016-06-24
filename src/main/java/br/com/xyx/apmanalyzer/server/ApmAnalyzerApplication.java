package br.com.xyx.apmanalyzer.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;

@SpringBootApplication
public class ApmAnalyzerApplication {

	public static String ROOT = "src/main/resources/static/web/upload";
	
	public static void main(String[] args) {
		String root = System.getProperty("rootPath");
		if( root != null ){
			//redefini caminho
			JavaWrapper.PATH = root+JavaWrapper.PATH;
			JavaWrapper.PATH_ACAO = JavaWrapper.PATH + "/acao";
			JavaWrapper.PATH_COMO_FAZER = JavaWrapper.PATH + "/como_fazer";
			JavaWrapper.PATH_PROPOSTA = JavaWrapper.PATH + "/proposta";
			JavaWrapper.PATH_ANALISE = JavaWrapper.PATH + "/analise";
		}
		SpringApplication.run(ApmAnalyzerApplication.class, args);
	}
}