$(document).ready(function(){
	var usuario = new TUsuario;
	
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