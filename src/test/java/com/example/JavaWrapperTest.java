package com.example;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;
import br.com.xyx.apmanalyzer.server.controller.acao.Acao;
import br.com.xyx.apmanalyzer.server.controller.analise.Analise;
import br.com.xyx.apmanalyzer.server.controller.analise.Help;
import br.com.xyx.apmanalyzer.server.controller.analise.Questao;
import br.com.xyx.apmanalyzer.server.controller.analise.Resposta;
import br.com.xyx.apmanalyzer.server.controller.comoFazer.ComoFazer;
import junit.framework.TestCase;

public class JavaWrapperTest extends TestCase{

	public void testSalvaAcao(){
		String id = null;
		String nome = "aaaa";
		String conteudo = "<b>de qual e</b>";
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.salvaAcao( id, nome, conteudo );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	public void testSalvaAnaliseAtributo(){
		//Object {idAnalise: "xptoII", id: "q01", valor: "xxxx"}
		String id = null;
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.salvaAnaliseAtributo( "xptoII", "r01", "xoxoxo", "nome" );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	
	public void testBuscaAnaliseDisco(){
		String json = null;
		JavaWrapper w = new JavaWrapper();
		try {
			json = w.recuperaAnaliseByIdJson("xptoII");
			System.out.println( json );
		} catch (Exception e) {
			e.printStackTrace();
			assertEquals(false, true );
		}
		assertEquals( json!= null, true );
	}
	
	public void testAnaliseDisco(){
		JavaWrapper w = new JavaWrapper();
		
		Analise analise = new Analise();
		analise.id = "xptoII";
		analise.nome = "Teste Analise xpto";
		analise.questoes = makeQuestao();
		
		String id = null;
		try {
			id = w.salvaAnalise( analise );
		} catch (Exception e) {
			e.printStackTrace();
			
		}
		assertEquals(analise.id, id );
	}
	private List<Questao> makeQuestao() {
		List<Questao> l = new ArrayList<>();
		Questao q = new Questao();
		q.id ="q01";
		q.nome= "Nome da questao 01";
		
		Help h = new Help();
		h.doc = "<b>Ajuda para entender essa questao</b>";
		q.help = h;
		List<Resposta> lr = new ArrayList<>();
		Resposta r = new Resposta();
		r.id = "r01";
		r.nome = "Resposta 01";
		r.help = h;
		r.idComoFazer = "performance_basica";
		lr.add(r );
		q.respostas = lr;
		
		l.add(q);
		return l;
	}
	public void testSalvaComoFazer(){
		JavaWrapper w = new JavaWrapper();
		ComoFazer comoFazer = new ComoFazer("Teste_inde", "Teste indentificador", "<h1>so para verII</h1>");
		
		String id = null;
		try {
			id = w.savaComoFazer( comoFazer );
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		assertEquals(id != null, true);
	}
	public void testeBuscaComoFazer(){
		JavaWrapper w = new JavaWrapper();
		
		Collection<ComoFazer> list= w.getAllComoFazer();
		for (ComoFazer comoFazer : list) {
			System.out.println( comoFazer );
		}
		
		assertEquals(list != null, true);
		
	}
	
	public void testeAcao(){
		JavaWrapper w = new JavaWrapper();
		
		Collection<Acao> list= w.getAllAcoes();
		for (Acao acao : list) {
			System.out.println( acao );
		}
		
		assertEquals(list != null, true);
	}
	public void testAnalise(){
		JavaWrapper w = new JavaWrapper();
		
		Collection<Analise> list= w.getAllAnalises();
		for (Analise analise : list) {
			System.out.println( analise );
		}
		
		assertEquals(list != null, true);
	}
	public void testProposta(){
		JavaWrapper w = new JavaWrapper();
		String json = w.getAllPropostasAsJson();
		
		assertEquals(json != null, true);
	}
}
