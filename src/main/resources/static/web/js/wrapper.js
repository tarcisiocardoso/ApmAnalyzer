function Wrapper(){

	this.getAtividade = function( promisse ){
		if( typeof javaWrapper === "undefined"){
			$.get( "/atividades", promisse);
		}else{
			console.log('nao implementado.....');
			var json = javaWrapper.getAllAtividadeAsJson();
			promisse( JSON.parse(json) );
		}
	};
	this.getComoFazer = function( promisse ){
		if( typeof javaWrapper === "undefined"){
			$.get( "/comoFazer", promisse);
		}else{
			console.log('nao implementado.....');
			var json = javaWrapper.getAllComoFazerAsJson();
			promisse( JSON.parse(json) );
		}
	};
	this.getPropostas = function( promisse ){
		if( typeof javaWrapper === "undefined"){
			$.get( "/propostas", promisse);
		}else{
			var json = javaWrapper.getAllPropostasAsJson();
			promisse( JSON.parse(json) );
		}
	};
	this.getAnalises = function( promisse ){
		if( typeof javaWrapper === "undefined"){
			$.get( "/analises", promisse);
		}else{
			console.log('nao implementado.....');
//			var json = javaWrapper.getAllPropostasAsJson();
//			promisse( JSON.parse(json) );
		}
	};
	this.getAcoes = function( promisse ){
		if( typeof javaWrapper === "undefined"){
			$.get( "/acoes", promisse);
		}else{
			var json = javaWrapper.getAllAcaoAsJson();
			promisse( JSON.parse(json) );
		}
	}
}

wrapper = new Wrapper();