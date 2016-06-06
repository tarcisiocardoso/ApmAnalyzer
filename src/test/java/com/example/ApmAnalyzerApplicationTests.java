package com.example;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import br.com.xyx.apmanalyzer.server.ApmAnalyzerApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ApmAnalyzerApplication.class)
@WebAppConfiguration
public class ApmAnalyzerApplicationTests {

	@Test
	public void contextLoads() {
		System.out.println("xxxxxxxxxxxxxxx");
	}

}
