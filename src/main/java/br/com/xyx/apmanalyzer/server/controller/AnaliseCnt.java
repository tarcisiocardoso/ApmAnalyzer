package br.com.xyx.apmanalyzer.server.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;
import br.com.xyx.apmanalyzer.server.controller.analise.Analise;
import br.com.xyx.apmanalyzer.server.controller.analise.AnaliseCmd;

@RestController
public class AnaliseCnt {

	@RequestMapping(value = "/analise/{id}", method=RequestMethod.GET)
	public Analise buscaAnalisePorId(@PathVariable("id") String id){
		JavaWrapper w = new JavaWrapper();
		Analise analise = null;
		try {
			analise = w.recuperaAnaliseById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return analise;
	}
	@RequestMapping(value = "/analise/savaAtributo", method = RequestMethod.POST)
	public RespostaSimples saveAnaliseAtributo(HttpServletRequest request){
		System.out.println(">>>saveAnaliseAtributo<<< ");
		System.out.println( request.getParameter("nome") );
		
		String identificador = (new AnaliseCmd()).salvaAnaliseAtributo(request.getParameter("idAnalise"), 
				request.getParameter("id"), request.getParameter("valor"), 
				request.getParameter("tipo"));
		
		return new RespostaSimples(true, identificador );
	}
	
	@RequestMapping(value = "/analise", method = RequestMethod.POST, headers = {"Content-type=application/json"})
    public RespostaSimples saveAnalise(@RequestBody Analise analise){
       
		System.out.println( analise );
        String identificador = "";
        try {
        	identificador = (new AnaliseCmd()).salvaAnalise(analise);
		} catch (Exception e) {
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
}