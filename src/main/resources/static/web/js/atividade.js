var idAtividadeAtual = null;

function confirmaRemoveAtividade(){
	
	if( idAtividadeAtual != null ){
		var nome = mm.getNome();
		$('#myModal .modal-title').html("Exclusão da atividade "+ nome );
		
		$('#myModal .modal-body').html("<h3>Confirma exclusão?</h3>");
		var btn = $('#myModal').find(".btn-ok");
		
		btn.show();
		
		btn.attr("onclick", "excluiAtividade()");
	
		$('#myModal').modal('show');
	}
}
function excluiAtividade(){
	$.post( "/atividade/remove",  {identificador:idAtividadeAtual} ).done(function( json ) {
		openListaAtividade();
	 });
	
	
}

function novaAtividade(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$( "#tituloPagina" ).html( "Nova Atividade" );
	
	console.log('>>>novaAtividade<<<');
	idAtividadeAtual = null;
	
	if( !idAtividadeAtual){
		var url = "app/atividade/content.html";
		console.log(url);
		$.get( url, function( data ) {
			  $( "#atividadeContainer" ).html( data );		  
		});
	}else{
		mm.novo();
	}
	
}
function openAtividade(){
	console.log('>>>>>'+idAtividadeAtual+"<<<<<<");
	if( idAtividadeAtual == null){
		
	}else{
		var url = "./base/atividade/"+ idAtividadeAtual +"/index.html";
		$.get( url, function( data ) {
			mm.open(data);
		});
	}
}


function save(){
	console.log('========================');
	var json = mm.getMMJson();
	var nome = mm.getNome();
	
	$.post( "/atividade",  {id: idAtividadeAtual, nome: nome, conteudo: json } ).done(function( json ) {
		console.log(json);
		if (json.sucesso) {
			$('#myModal .modal-title').html("Sucesso!");
		} else {
			$('#myModal .modal-title').html("Problema!");
		}
		console.log('json.dado: '+json.dado)
		$('#myModal .modal-body').html("sucesso");
		
		idAtividadeAtual = json.dado;
		
		$('#myModal').modal('show');
	 });
	
	
	console.log('========================');
}

function openListaAtividade(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/atividade/index.html", function( data ) {
		  $( "body" ).html( data );
		  montaListaAtividade();
	});
}
function montaListaAtividade(){
	
	wrapper.getAtividade(function( data ) {
		  console.log("-->"+data);
		  
		  $.each( data, function (index, Atividade){
			  var html = "<a href='#' onClick=\"showAtividade2(\'"+Atividade.id+"\', \'"+Atividade.nome+"\'); return false\"><h4>"+Atividade.nome+"</h4></a>";
			  $( "#idAtividade" ).append(html);
		  });
		}
	);
}
function showAtividade2(id, nome){
	$( "#tituloPagina" ).html( nome );
	idAtividadeAtual = id;
	
	var url = "app/atividade/content.html";
	console.log(url);
	$.get( url, function( data ) {
		  $( "#atividadeContainer" ).html( data );		  
	});
	

}