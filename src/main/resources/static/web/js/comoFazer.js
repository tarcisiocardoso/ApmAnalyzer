function salvaNovoConhecimento(){

	var data = $( "#formulario" ).serialize();
	
	$.post( "/comoFazer",  data )
		.done(function( json ) {
		    //alert( "Data Loaded: " + data );
			console.log(json);
			
			if( json.sucesso ){
				$('#myModal .modal-title').html("Sucesso!");
			}else{
				$('#myModal .modal-title').html("Problema!");
			}
			$('#myModal .modal-body').html( json.dado);
			$('#myModal').modal('show')
		  });
}
function novoComoFazer(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/howto/novo.html", function( data ) {
		  $( "body" ).html( data );
		  
		  montaListaComoFazer();
		  
		});
}
function montaListaComoFazer(){
	
	wrapper.getComoFazer(function( data ) {
		  console.log("-->"+data);
		  
		  $.each( data, function (index, comoFazer){
			  var html = "<a href='#' onClick=\"showComoFazer(\'"+comoFazer.id+"\', \'"+comoFazer.nome+"\'); return false\"><h4>"+comoFazer.nome+"</h4></a>";
			  console.log( '===>'+html );
			  $( "#idComoFazer" ).append(html);
		  });
		}
	);
}
function showComoFazer(id, nome){
	$( "#tituloPagina" ).html( "<h3><a href='index.html' onClick=\"openListaComoFazer(); return false;\">"+nome+"</a></h3>" );
	
	var url = "./base/como_fazer/"+id+"/index.html";
	console.log(url);
	$.get( url, function( data ) {
		  $( "#comoFazerContainer" ).html( data );		  
	});
}
function openListaComoFazer(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/howto/index.html", function( data ) {
		  $( "body" ).html( data );
		  montaListaComoFazer();
	});
}