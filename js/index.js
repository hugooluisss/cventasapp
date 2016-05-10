var usuario = new TUsuario;

$(document).ready(function(){
	if (usuario.isSesionIniciada()){
		getPanel();
		getMenu();
	}else{
		loadLogin();
	}
	
	function getMenu(){
		$.get("vistas/menu.html", function(resp){
			$("#menu").html(resp);
			$("body").addClass("conmenu");
			
			$("#menuPrincipal a").click(function(){
				$('#menuPrincipal').parent().removeClass("in");
				$('#menuPrincipal').parent().attr("aria-expanded", false);
			});
			
			var objUsuario = new TUsuario;
			
			$("[vista=nombreUsuario]").html(objUsuario.getNombre());
			
			$("#menuPrincipal [liga=miEmpresa]").click(function(){
				miEmpresaPanel();
			});
			
			$("#menuPrincipal [liga=usuarios]").click(function(){
				usuarios();
			});
			
			$("#menuPrincipal [liga=categorias]").click(function(){
				categorias();
			});
			$("#menuPrincipal [liga=productos]").click(function(){
				productos();
			});
			
			$("#menuPrincipal [liga=clientes]").click(function(){
				clientes();
			});
			
			//Opciones del menú
			$("#menuPrincipal [liga=salir]").click(function(){
				if(confirm("¿Seguro?")){
					objUsuario.logout({
						after: function(){
							location.reload(true);
						}
					});
				}
			});
		});
	}
	
	function getPanel(){
		$.get("vistas/panel.html", function(resp){
			$("#modulo").html(resp);
		});
	}

});