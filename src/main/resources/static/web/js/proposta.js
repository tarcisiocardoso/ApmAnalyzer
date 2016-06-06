function openListaProposta(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "proposta.html", function( data ) {
		  $( "body" ).html( data );
		  
		  montaListaProposta();
		  
		});
}
function showProposta(id){
	var url = "./proposta/"+id+"/index.html";
	
	$.get( url, function( data ) {
		  $( "#propostaContainer" ).html( data );		  
	});
}
function montaListaProposta(){
	console.log('============');
	//<a href="../acao/teste_carga/index.html"><h4>Boas praticas em SQL</h4></a>
	//var a = document.createElement('a');
	//a.className = 'panel-body';
	//a.innerHTML = '<h4>so para ver</h4>';
	
//	$( "#idProposta" ).append('<a href="../acao/teste_carga/index.html"><h4>lalalalalal<<<<<<<</h4></a>'); 
	
	wrapper.getPropostas(function( data ) {
		  console.log("-->"+data);
		  
		  $.each( data, function (index, proposta){
			  var html = "<a href='#' onClick=\"showProposta(\'"+proposta.id+"\'); return false\"><h4>"+proposta.nome+"</h4></a>";
			  console.log( '===>'+html );
			  $( "#idProposta" ).append(html);
		  });
		}
	);
}
