package br.com.xyx.apmanalyzer.server.controller;

import java.util.Collection;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;
import br.com.xyx.apmanalyzer.server.controller.acao.Acao;
import br.com.xyx.apmanalyzer.server.controller.acao.AcaoCmd;
import br.com.xyx.apmanalyzer.server.controller.analise.Analise;
import br.com.xyx.apmanalyzer.server.controller.analise.AnaliseCmd;
import br.com.xyx.apmanalyzer.server.controller.atividade.Atividade;
import br.com.xyx.apmanalyzer.server.controller.atividade.AtividadeCmd;
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
	@RequestMapping(value = "/proposta/remove", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples removeProposta(HttpServletRequest request){
       
		String identificador = request.getParameter("identificador");
        
        try {
        	identificador = (new PropostaCmd()).removeProposta(identificador);
		} catch (Exception e) {
//			e.printStackTrace();
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
	
	@RequestMapping(value = "/atividade/remove", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples removeAtvidade(HttpServletRequest request){
       
		String identificador = request.getParameter("identificador");
        
        try {
        	identificador = (new AtividadeCmd()).removeAtividade(identificador);
		} catch (Exception e) {
//			e.printStackTrace();
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
	@RequestMapping(value = "/atividade", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples saveAtividadeJson(HttpServletRequest request){
		
		String identificador = request.getParameter("id");
        String nome = request.getParameter("nome");
        String conteudo = request.getParameter("conteudo");
        
        System.out.println("Nome: "+nome);
        System.out.println("Conteudo: "+conteudo );
        
        try {
        	identificador = (new AtividadeCmd()).savaAtividade( new Atividade(identificador, nome, conteudo));
		} catch (Exception e) {
//			e.printStackTrace();
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
	
	@RequestMapping(value = "/proposta", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples savePropostaJson(HttpServletRequest request){
       
		System.out.println(request.getParameter("nome"));
		String identificador = request.getParameter("identificador");
        String nome = request.getParameter("nome");
        String conteudo = request.getParameter("content");
        Proposta proposta = new Proposta(identificador, nome, conteudo );
        
        try {
        	identificador = (new PropostaCmd()).savaProposta(proposta);
		} catch (Exception e) {
//			e.printStackTrace();
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
	
	@RequestMapping(value = "/comoFazer/remove", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples removeHowTo(HttpServletRequest request){
       
		System.out.println(request.getParameter("nome"));
		String identificador = request.getParameter("identificador");
        
        try {
        	identificador = (new ComoFazerCmd()).removeComoFazer(identificador);
		} catch (Exception e) {
//			e.printStackTrace();
			return new RespostaSimples(false, e.getMessage() );
		}
        
        return new RespostaSimples(true, identificador );
    }
	
	@RequestMapping(value = "/comoFazer", method = RequestMethod.POST, consumes="application/json",headers = "content-type=application/x-www-form-urlencoded")
    public RespostaSimples saveHowToJson(HttpServletRequest request){
       
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
	
	@RequestMapping(value = "/acao/remove", method = RequestMethod.POST)
    public RespostaSimples removeAcao(HttpServletRequest request){
       
		String idAcao = request.getParameter("idAcao");
        
        System.out.println(idAcao);
        
        JavaWrapper w = new JavaWrapper();
		String id = "nok";
		try {
			id = w.removeAcao( idAcao );
		} catch (Exception e) {
			e.printStackTrace();
			return new RespostaSimples(false, "Problema ao gravar ação: "+e.getMessage() );
		}
        
        return new RespostaSimples(true, id );
    }
	@RequestMapping(value = "/acao", method = RequestMethod.POST)
    public RespostaSimples saveAcao(HttpServletRequest request){
       
		String idAcao = request.getParameter("idAcao");
		String nomeAcao = request.getParameter("nomeAcao");
        String conteudo = request.getParameter("conteudo");
        
        System.out.println(idAcao);
        System.out.println(nomeAcao);
        System.out.println(conteudo);
        
        JavaWrapper w = new JavaWrapper();
		String id = "nok";
		try {
			id = w.salvaAcao( idAcao, nomeAcao, conteudo );
		} catch (Exception e) {
			e.printStackTrace();
			return new RespostaSimples(false, "Problema ao gravar ação: "+e.getMessage() );
		}
        
        return new RespostaSimples(true, id );
    }
	
	@RequestMapping(value="/comoFazer")
	public Collection<ComoFazer> getComoFazer(){
		
		return (new ComoFazerCmd()).getAllComoFazer();
	}
	
	@RequestMapping(value="/acoes")
	public Collection<Acao> getAcoes(){
		
		return (new AcaoCmd()).getAllAcoes();
	}
	
	@RequestMapping(value="/atividades")
	public Collection<Atividade> getAtividade(){
		return (new AtividadeCmd()).getAllAtividades();
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