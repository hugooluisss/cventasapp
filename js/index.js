$(document).ready(function(){
	var usuario = new TUsuario;
	
	if (usuario.isSesionIniciada()){
		getPanel();
	}else{
		loadLogin();
	}
	
	
	
	function getPanel(){
		$.get("vistas/panel.html", function(resp){
			$("#modulo").html(resp);
						
			//Opciones del menú
			$("#menuPrincipal .salir").click(function(){
				if(confirm("¿Seguro?")){
					var obj = new TUsuario;
					obj.logout({
						after: function(){
							location.reload(true);
						}
					});
				}
			});
			
			$("#menuPrincipal a").click(function(){
				$('#menuPrincipal').parent().removeClass("in");
				$('#menuPrincipal').parent().attr("aria-expanded", false);
			});
			
			$("#menuPrincipal .oficinas").click(function(){
				getOficinas();
			});
			
			$("#menuPrincipal .miCuenta").click(function(){
				getPanelMiCuentaAbogado();
			});
			
			$("#menuPrincipal .categorias").click(function(){
				getPanelEspecialidades();
			});
			
			//getIndex();
		});
	}

});