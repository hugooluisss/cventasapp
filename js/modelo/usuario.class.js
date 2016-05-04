TUsuario = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.login = function(usuario, pass, fn){
		$.post(server + 'index.php?mod=clogin&action=login', {
			"usuario": usuario,
			"pass": pass,
			"movil": 1
		}, function(data){
			if (data.band == false){
				console.log("Los datos del usuario no son válidos");
			}else{
				var datos = data.datos;
				var obj = new Object;
				obj.identificador = datos.identificador;
				obj.usuario = usuario;
				obj.tipo = datos.tipo;
				obj.nombre = datos.nombre;
				obj.empresa = datos.idEmpresa;
				
				window.localStorage.setItem("sesion", JSON.stringify(obj));
			}
			
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.logout = function(fn){
		if (fn.before != undefined) fn.before();
		
		window.localStorage.clear();
		
		if (fn.after != undefined) fn.after();
	}
	
	this.isSesionIniciada = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return false;
		else{
			var data = JSON.parse(this.sesion);
			console.log(this.sesion);
			return data.tipo;
		}
	}
};