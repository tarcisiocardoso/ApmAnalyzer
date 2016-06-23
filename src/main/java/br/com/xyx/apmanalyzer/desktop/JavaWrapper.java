package br.com.xyx.apmanalyzer.desktop;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.xyx.apmanalyzer.server.controller.acao.Acao;
import br.com.xyx.apmanalyzer.server.controller.analise.Analise;
import br.com.xyx.apmanalyzer.server.controller.analise.Help;
import br.com.xyx.apmanalyzer.server.controller.analise.Questao;
import br.com.xyx.apmanalyzer.server.controller.analise.Resposta;
import br.com.xyx.apmanalyzer.server.controller.comoFazer.ComoFazer;
import br.com.xyx.apmanalyzer.server.controller.proposta.Proposta;

public class JavaWrapper {

	private static final String PATH = "src/main/resources/static/web/";
	private static final String PATH_ACAO = PATH + "/acao";
	private static final String PATH_COMO_FAZER = PATH + "/como_fazer";
	private static final String PATH_PROPOSTA = PATH + "/proposta";
	private static final String PATH_ANALISE = PATH + "/analise";

	public Collection<ComoFazer> getAllComoFazer() {
		String base = "como_fazer";
		File file = new File(PATH + base);
		ArrayList<ComoFazer> list = new ArrayList<>();
		try {
			Properties hm = this.getInit(base);

			// String uri = file.toURI().toURL().toString();
			File[] fs = file.listFiles();
			for (File f : fs) {
				if (f.isDirectory()) {
					String key = f.getName();
					String nome = (hm.containsKey(key)) ? hm.getProperty(key) : key;
					
					list.add(new ComoFazer(key, nome, base+"/"+key+"/index.html"));
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}
	public String getAllAcaoAsJson() {
		String json = "{}";

		ObjectMapper mapper = new ObjectMapper();
		try {
			json = mapper.writeValueAsString(getAllAcoes());
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return json;
	}
	public Collection<Acao> getAllAcoes() {
		String base = "acao";
		File file = new File(PATH + base);
		ArrayList<Acao> list = new ArrayList<>();
		try {
			Properties hm = this.getInit(base);

			// String uri = file.toURI().toURL().toString();
			File[] fs = file.listFiles();
			for (File f : fs) {
				if (f.isDirectory()) {
					String key = f.getName();
					String nome = (hm.containsKey(key)) ? hm.getProperty(key) : key;
					list.add(new Acao(key, nome));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	public Collection<Analise> getAllAnalises() {
		File file = new File(PATH + "analise");
		ArrayList<Analise> list = new ArrayList<>();
		try {
			Properties hm = this.getInit("analise");

			// String uri = file.toURI().toURL().toString();
			File[] fs = file.listFiles();
			for (File f : fs) {
				if (f.isDirectory()) {
					String key = f.getName();
					String nome = (hm.containsKey(key)) ? hm.getProperty(key) : key;
					list.add(new Analise(key, nome));
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public Collection<Proposta> getAllPropostas() {
		String base = "proposta";
		File file = new File(PATH + base);
		ArrayList<Proposta> list = new ArrayList<>();
		try {
			Properties hm = this.getInit(base);

			// String uri = file.toURI().toURL().toString();
			File[] fs = file.listFiles();
			for (File f : fs) {
				if (f.isDirectory()) {
					String key = f.getName();
					String nome = (hm.containsKey(key)) ? hm.getProperty(key) : key;
					list.add(new Proposta(key, nome));
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public String getAllPropostasAsJson() {
		String json = "{}";

		ObjectMapper mapper = new ObjectMapper();
		try {
			json = mapper.writeValueAsString(getAllPropostas());
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return json;
	}

	private Properties getInit(String squema) throws Exception{
		File file = new File(PATH + squema + "/init.properties");
		Properties pro = new Properties();
		BufferedReader br = null;
		HashMap<String, String> hm = new HashMap<>();
		try {
			pro.load( new FileInputStream(file) );
			
//			FileReader arq = new FileReader(file);
//			br = new BufferedReader(arq);
//
//			String linha = "";
//			while ((linha = br.readLine()) != null) {
//				if( linha.trim().isEmpty() ) continue;
//				String[] sp = linha.split("=");
//				hm.put(sp[0], sp[1]);
//			}
		} catch (IOException e) {
			e.printStackTrace();
			throw new Exception("Analise mau formatada. ");
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (IOException e) {
				}
		}
		return pro;
//		return hm;
	}

	public void log(String msg) {
		System.out.println(msg);
	}
	private String formatId(String id, String nome ){
		if (id == null || id.trim().length() == 0) {
			String nm = nome;
			nm = nm.replaceAll(" ", "_");
			if (nm.length() > 10) {
				nm = nm.substring(0, 10);
			}
			id = System.currentTimeMillis() + "_" + nm;
		}
		return id;
	}
	public String salvaAcao(String id, String nome, String conteudo) throws Exception {
		if( nome == null || nome.trim().length() == 0){
			throw new Exception("Nome obrigatório");
		}
		if( nome == null || nome.trim().length() == 0){
			throw new Exception("Conteudo obrigatório");
		}
		id = formatId(id, nome);
		
		File file = new File(PATH_ACAO + "/" + id);
		try {
			if (file.isDirectory()) { // ja existe. Atualiza
				saveFile(file.getCanonicalPath(), conteudo);
			} else {
				addInit(PATH_ACAO, id, nome);
				// file.mkdir();
				Path path = Paths.get(file.getCanonicalPath());
				Files.createDirectories(path);

				saveFile(file.getCanonicalPath(), conteudo);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return id;
	}	
	public String salvaProposta(Proposta proposta) throws Exception {
		if( proposta.nome == null || proposta.nome.trim().length() == 0){
			throw new Exception("Nome obrigatório");
		}
		proposta.id = formatId(proposta.id, proposta.nome);
		
		File file = new File(PATH_PROPOSTA + "/" + proposta.id);
		try {
			if (file.isDirectory()) { // ja existe. Atualiza
				saveFile(file.getCanonicalPath(), proposta.conteudo);
			} else {
				addInit(PATH_PROPOSTA, proposta.id, proposta.nome);
				// file.mkdir();
				Path path = Paths.get(file.getCanonicalPath());
				Files.createDirectories(path);

				saveFile(file.getCanonicalPath(), proposta.conteudo);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return proposta.id;
	}
	public String salvaComoFazer(ComoFazer comoFazer) throws Exception {
		if( comoFazer.nome == null || comoFazer.nome.trim().length() == 0){
			throw new Exception("Nome obrigatório");
		}
		comoFazer.id = formatId(comoFazer.id, comoFazer.nome);
		
		File file = new File(PATH_COMO_FAZER + "/" + comoFazer.id);
		try {
			if (file.isDirectory()) { // ja existe. Atualiza
				saveFile(file.getCanonicalPath(), comoFazer.conteudo);
			} else {
				addInit(PATH_COMO_FAZER, comoFazer.id, comoFazer.nome);
				// file.mkdir();
				Path path = Paths.get(file.getCanonicalPath());
				Files.createDirectories(path);

				saveFile(file.getCanonicalPath(), comoFazer.conteudo);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return comoFazer.id;
	}
	private void saveFile(String path, String conteudo, String nome) {
		try (PrintWriter out = new PrintWriter(path +"/"+ nome)) {
			out.print(conteudo);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	private void saveFile(String path, String conteudo) {
		saveFile(path, conteudo, "index.html");
	}

	private void addInit(String path, String id, String nome) throws Exception {
		try {
			File f = new File(path + "/init.properties");
			if( !f.exists() ){
				f.createNewFile();
			}
			Properties p = new Properties();
			p.load( new FileInputStream(f) );
			
			p.setProperty(id, nome);
			p.store(new FileOutputStream(f), "Arquivo modificado");
			
//			Files.write(Paths.get(path + "/init.properties"), ("\n"+id + "=" + nome).getBytes(),
//					StandardOpenOption.APPEND);
		} catch (IOException e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}

	}
	public String salvaAnaliseAtributo(String idAnalise, String id, String valor, String tipo) throws Exception {
		if( idAnalise == null) throw new Exception("Identificador da analise nao informado");
		if( id == null) throw new Exception("id da questao deve ser informado");
		if( valor == null ) throw new Exception("Novo valor deve ser informado");
		
		System.out.println("buscando: "+id);
		
		File file = new File(PATH_ANALISE + "/" + idAnalise);
		File[] fs = file.listFiles();
		File fAtributo = null;
		for (File f : fs) {
			if (f.isDirectory()) {
				String key = f.getName();
				System.out.println(key);
				if( key.equals(id) ){
					fAtributo = f;
					continue;
				}else{
					fAtributo = buscaAnaliseAtributo( f, id );
					if( fAtributo != null ) break;
				}
			}
		}
		if( fAtributo == null){
			throw new Exception("Id: "+id+" não encontrado. Problema estrutural com os dados.");
		}
		System.out.println("====================");
		
		fs = fAtributo.listFiles();
		for (File f : fs) {
			System.out.println( f.getName() );
		}
		switch (tipo){
			case "nome":
				mudaAnaliseAtributoNome(id, fAtributo, valor);
				break;
			default:
				throw new Exception("Tipo da modificação desconhecido. Problema com os dados do cliente");
		}
		limpaCacheAnalise(idAnalise);
		return "ok";
	}
	private void limpaCacheAnalise(String idAnalise) throws Exception {
		File file = new File(PATH_ANALISE + "/" + idAnalise+"/conteudo.json");
		if( file.exists() ){
			try{
				Path path = Paths.get(file.getCanonicalPath());
				Files.delete( path );
			} catch (IOException e) {
				e.printStackTrace();
				throw new Exception ("Problema imprevisto: "+e.getMessage() );
			}
		}
	}
	private void mudaAnaliseAtributoNome(String id, File file, String valor) throws Exception {
		System.out.println(file.getAbsolutePath() );
		String nm = file.getAbsolutePath();
		nm = nm.substring(0, nm.length() - id.length() );
		System.out.println( nm );
		addInit(nm, id, valor);
		
	}
	private File buscaAnaliseAtributo(File file, String id) {
		System.out.println(file.getAbsolutePath() );
		File[] fs = file.listFiles();
		for (File f : fs) {
			if (f.isDirectory()) {
				String key = f.getName();
				System.out.println(key);
				if( key.equals(id) ){
					return f;
				}else{
					File fRet = buscaAnaliseAtributo( f, id );
					if( fRet != null ) {
						return fRet;
					};
				}
			}
		}
		return null;
	}
	public String salvaAnalise(Analise analise) throws Exception {
		if( analise == null) throw new Exception("Analise não informada");
		if( analise.nome == null) throw new Exception("Nome da analise é obrigatório");
		if( analise.questoes == null || analise.questoes.size() == 0) throw new Exception("Ao menos uma questão deve ser informada");
		if( analise.questoes.get(0).respostas == null || analise.questoes.get(0).respostas.size() == 0){ 
			throw new Exception("Ao menos uma resposta deve ser informada");
		}
		
		analise.id = formatId(analise.id, analise.nome);
		
		File file = new File(PATH_ANALISE + "/" + analise.id);
		try {
			if (!file.isDirectory()) { // ja existe. Atualiza
				addInit(PATH_ANALISE, analise.id, analise.nome);
				Path path = Paths.get(file.getCanonicalPath());
				Files.createDirectories(path);
			} 
			for (Questao questao : analise.questoes) {
				salvaQuestao(questao, file.getCanonicalPath());
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return analise.id;
	}
	private void salvaQuestao(Questao questao, String path) {
		questao.id = formatId(questao.id, questao.nome);
		
		File file = new File(path + "/" + questao.id);
		try {
			if (!file.isDirectory()) { // ja existe. Atualiza
				addInit(path, questao.id, questao.nome);
				Path p = Paths.get(file.getCanonicalPath());
				Files.createDirectories(p);
			} 
			if( questao.help != null ){
				saveFile(file.getCanonicalPath(), questao.help.doc, "help.html");
			}
			for (Resposta resposta : questao.respostas) {
				salvaResposta(resposta, file.getCanonicalPath());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private void salvaResposta(Resposta resposta, String path) {
		resposta.id = formatId(resposta.id, resposta.nome);
		
		File file = new File(path + "/" + resposta.id);
		try {
			if (!file.isDirectory()) { // ja existe. Atualiza
				addInit(path, resposta.id, resposta.nome);
				Path p = Paths.get(file.getCanonicalPath());
				Files.createDirectories(p);
			} 
			if( resposta.help != null ){
				saveFile(file.getCanonicalPath(), resposta.help.doc, "help.html");
			}
			if( resposta.propostas != null ){
				String dados = "";
				for (String proposta : resposta.propostas) {
					dados += proposta+"\n";
				}
				saveFile(file.getCanonicalPath(), dados, "propostas.txt");
			}
			if( resposta.questoes != null ){
				for (Questao questao: resposta.questoes ) {
					salvaQuestao(questao, file.getCanonicalPath());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private List<Resposta> recuperaRespostaDoArquivo(String path) throws Exception{
		List<Resposta> lst = new ArrayList<>();
		File file = new File(PATH+"/"+path);
		File fs[] = file.listFiles();
		for (File f : fs) {
			if( f.isDirectory() ){
				Properties hm = this.getInit(path );
				Resposta r = new Resposta();
				r.id = f.getName();
				r.nome = hm.getProperty( r.id );
				r.help = getHelpFromFile( path+"/"+r.id);
				r.propostas = getPropostaFromFile(path+"/"+r.id);
				if( r.help != null ) r.help.nomeHelp = r.nome;
				r.questoes = recuperaQuestoesDoArquivo(f, path );
				lst.add(r);
			}
		}
		return lst;
	}
	private String[] getPropostaFromFile(String path) {
		File file = new File(PATH+"/"+path+ "/propostas.txt");
		if( !file.exists() ) return null;
		ArrayList<String> conteudo = new ArrayList<String>();
		BufferedReader br = null;
		try {
			FileReader arq = new FileReader(file);
			br = new BufferedReader(arq);

			String linha = "";
			while ((linha = br.readLine()) != null) {
				conteudo.add(linha);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (IOException e) {
				}
		}
		return conteudo.toArray(new String[0]);
	}
	public List<Questao> recuperaQuestoesDoArquivo(File file, String id) throws Exception{
		List<Questao> lst = new ArrayList<>();
		File fs[] = file.listFiles();
		String baseFile = new File(PATH).getAbsolutePath() ;
		String base = file.getAbsolutePath();
		base = base.substring(baseFile.length(), base.length() );
		for (File f : fs) {
			if( f.isDirectory() ){
				Properties hm = this.getInit(base );
				Questao q = new Questao();
				q.id = f.getName();
				q.nome = hm.getProperty( q.id );
				q.help = getHelpFromFile( base+"/"+q.id);
				if( q.help != null ) q.help.nomeHelp = q.nome;
				q.respostas = recuperaRespostaDoArquivo(base+"/"+q.id );
				lst.add(q);
			}
		}
		return lst;
	}
	
	private String getConteudoFileAnalise(File file){
		String conteudo = "";
		BufferedReader br = null;
		try {
			FileReader arq = new FileReader(file);
			br = new BufferedReader(arq);

			String linha = "";
			while ((linha = br.readLine()) != null) {
				conteudo += linha;
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (IOException e) {
				}
		}
		return conteudo;
	}
	public String recuperaAnaliseByIdJson(String id) throws Exception {
		
		File file = new File(PATH_ANALISE+"/"+id+"/conteudo.json");
		if( file.exists() ){
			System.out.println("Buscando do cache....");
			return getConteudoFileAnalise(file);
		};
		
		Analise analise = recuperaAnaliseById(id);
		String json = null;
		ObjectMapper mapper = new ObjectMapper();
		try {
			json = mapper.writeValueAsString( analise );
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		if( !file.exists() ){
			saveFile(PATH_ANALISE+"/"+id, json, "conteudo.json");
		}
		return json;
	}
	public Analise recuperaAnaliseById(String id) throws Exception {
		File file = new File(PATH_ANALISE + "/" + id);
		if (!file.isDirectory()) {
			throw new Exception("Nao existe essa analise: "+id);
		} 
		Analise analise = new Analise();
		analise.id = id;
		
		Properties hm = this.getInit("analise");
		analise.nome = hm.getProperty(id);

		analise.questoes = recuperaQuestoesDoArquivo(file, id);
			
		return analise;
	}
	private Help getHelpFromFile(String path) {
		Help h = new Help();
		File file = new File(PATH+"/"+path+ "/help.html");
		if( !file.exists() ) return null;
		
		BufferedReader br = null;
		try {
			FileReader arq = new FileReader(file);
			br = new BufferedReader(arq);

			String linha = "";
			String html = "";
			while ((linha = br.readLine()) != null) {
				html += linha;
			}
			h.doc = html;
			
			
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null)
				try {
					br.close();
				} catch (IOException e) {
				}
		}

		return h;
	}

}