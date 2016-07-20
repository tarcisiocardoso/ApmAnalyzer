var moduloEdicao = false;
var idComoFazerAtual = null;

function editaHowTo(){
	console.log('.....');
	
	moduloEdicao = true;
	
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	var html = $("#comoFazerContainer").html();
	var nome = $( "#tituloPagina" ).html( );
	
	$.get( "app/howto/novo.html", function( data ) {
		  $( "body" ).html( data );

		  var element = document.querySelector("trix-editor");
		   //element.editor.setSelectedRange([0, $('#xHelp')[0].value.length ]);
		   element.editor.insertHTML( html );
		   
		   console.log( nome );
		   console.log( $("input[name='nome']") );
		   $("input[name='nome']").val( nome );
		   $("input[name='identificador']").val( idComoFazerAtual );
		});
}
function moduloExclusaoHowTo(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	if( idComoFazerAtual ){
		$('#myModal .modal-title').html("Exclusão da ação");
		
		$('#myModal .modal-body').html("<h3>Confirma exclusão?</h3>");
		var btn = $('#myModal').find(".btn-ok");
		btn.attr("onclick", "removeHowTo()");
		btn.show();
		
		$('#myModal').modal('show');
	}else {
		console.log( idAcaoAtual );
		isAcaoDeleteModel = true;
		
		var content = $('.panel-title');
		
		var html =
	    	'\
			<button class="btn btn-default pull-right trash" type="button" onClick="removeItem(this)"><i class="fa fa-trash"></i></button>\
	    	';
		content.append( html );
	}
}
function removeHowTo(){
	if( idComoFazerAtual ){
		$.post( "/comoFazer/remove",  {identificador: idComoFazerAtual } ).done(function( json ) {
			openListaComoFazer();
//			if( json.sucesso ){
//				$('#myModal .modal-title').html("Sucesso!");
//			}else{
//				$('#myModal .modal-title').html("Problema!");
//			}
//			var btn = $('#myModal').find(".btn-ok");
//			btn.hide();
//			$('#myModal .modal-body').html( json.dado);
//			$('#myModal').modal('show');
		 });
	}
}
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
	$( "#tituloPagina" ).html( nome );
	idComoFazerAtual = id;
	
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