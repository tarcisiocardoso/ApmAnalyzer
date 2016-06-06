package br.com.xyx.apmanalyzer.server.controller;

import java.util.Collection;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.xyx.apmanalyzer.server.controller.acao.Acao;
import br.com.xyx.apmanalyzer.server.controller.acao.AcaoCmd;
import br.com.xyx.apmanalyzer.server.controller.analise.Analise;
import br.com.xyx.apmanalyzer.server.controller.analise.AnaliseCmd;
import br.com.xyx.apmanalyzer.server.controller.comoFazer.ComoFazer;
import br.com.xyx.apmanalyzer.server.controller.comoFazer.ComoFazerCmd;
import br.com.xyx.apmanalyzer.server.controller.proposta.Proposta;
import br.com.xyx.apmanalyzer.server.controller.proposta.PropostaCmd;

@RestController
public class MainCnt {

	@RequestMapping(value="/ola")
	public String getOla(){
		
		return "ola";
	}
	
//	@RequestMapping(value="/comoFazer", method=RequestMethod.POST)
//	String animalSubmit(@RequestBody ComoFazer comoFazer, Model model){
//		System.out.println("=================");
//		System.out.println( comoFazer );
//		return "{\"sucesso\": \"ok\", \"id\": 1}";
//	}
	
	@RequestMapping(value = "/comoFazer", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples saveProfileJson(HttpServletRequest request){
       
		System.out.println(request.getParameter("nome"));
		String identificador = request.getParameter("identificador");
        String nome = request.getParameter("nome");
        String conteudo = request.getParameter("content");
        ComoFazer comoFazer = new ComoFazer(identificador, nome, conteudo );
        
        try {
        	identificador = (new ComoFazerCmd()).savaComoFazer(comoFazer);
		} catch (Exception e) {
//			e.printStackTrace();
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
	
	@RequestMapping(value="/comoFazer")
	public Collection<ComoFazer> getComoFazer(){
		
		return (new ComoFazerCmd()).getAllComoFazer();
	}
	
	@RequestMapping(value="/acoes")
	public Collection<Acao> getAcoes(){
		
		return (new AcaoCmd()).getAllAcoes();
	}
	
	@RequestMapping(value="/propostas")
	public Collection<Proposta> getProposta(){
		return (new PropostaCmd()).getAllPropostas();
	}
	
	@RequestMapping(value="/analises")
	public Collection<Analise> getAllAnalises(){
		
		return (new AnaliseCmd()).getAllAnalises();
	}
}