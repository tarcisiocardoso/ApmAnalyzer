package br.com.xyx.apmanalyzer.server.controller.teste;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TesteController {

	@Autowired
	CustomerService cs;

	@RequestMapping(value="/eai")
	public String getOla(){
		cs.setMessage("valor");
		return "ola";
	}
	@RequestMapping(value="/xx")
	public String getaaaa(){
		cs.setMessage("xtxtxtxtxt");
		return "ola";
	}
	
	@RequestMapping(value="/aff")
	public String getAff(){
		
		return "==>"+cs.getMessage();
	}
}
