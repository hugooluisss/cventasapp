TCliente = function(){
	var self = this;
	
	this.add = function(id, nombre, sexo, telefono, email, direccion, limite, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"action": "guardar",
				"id": id,
				"nombre": nombre,
				"sexo": sexo,
				"telefono": telefono,
				"email": email,
				"direccion": direccion,
				"empresa": usuario.getEmpresa(),
				"limite": limite
			}, function(data) {
				if (data.band == 'false')
					console.log(data.mensaje == ''?"Upps. Ocurrió un error al agregar al cliente":data.mensaje);
				
				if (fn.after !== undefined) fn.after(data);
			}, "json"
		);
	};
	
	this.del = function(cliente, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
			"action": "del",
			"id": cliente,
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar al cliente");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
};