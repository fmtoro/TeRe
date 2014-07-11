var gRecetaId = 0;
var gRecetaStr = "";
var gNextLoad = "page-Lista";
var gRInfo = "";
var gDialogInfo = "";
var ginfoArrForDialog = [];
var startOfUrl = "https://teredata.azure-mobile.net/tables/";
var gTmStmpCk = 0;
var gTmStmpInit = 0;
var gAppKEY = "rzBeBHPVrSQgdVdhSGdfPeyBdLQzST92";



function AppInit() {
    
    ConnectEvents();
									//$.mobile.changePage("#page-busqueda");		
    GetRecetas();
}

//if (window.cordova) {
//
//    document.addEventListener("deviceready", AppInit, false);
//    
//} else {
//
//    AppInit();
//
//}


function GetRecetas() {
    //$.support.cors = true;
    //alert("L Antes");
    var str = "";
    var strParaLista = "";
    
    $.ajax({            //     ==========AJAX para Recetas (todas) Inicial
        url: startOfUrl + "receta?$orderby=rango asc",
        headers: {
            "x-zumo-application": gAppKEY
        },
        dataType: 'json',
        
        success: function (data) {
            

            strParaLista = "<ul data-role='listview' data-inset='true'>";
            str = "<ul data-role='listview' data-filter='true' data-filter-reveal='true' data-filter-placeholder='Busca recetas...' data-inset='true'>";
            $.each(data, function (index, receta) {
                var tStr = this.NombreCorto;
                if (!tStr) {  //==================********/////// Chequea si es null undefined o false
                
                    strParaLista += "<li class='x'><a class='ftLosListList' href='#page-detalle'>" +
                            "<img src='" + this.FotoPpal + "' />" + this.Nombre + "</a><span hidden='true'>" +
                            this.id + "</span></li>";
                } else {
                    strParaLista += "<li class='x'><a class='ftLosListList' href='#page-detalle'>" +
                            "<img src='" + this.FotoPpal + "' />"+ tStr +"</a><span hidden='true'>" +
                            this.id + "</span></li>";
                }
                str += "<li class='x'><a class='ftLosListBusq' href='#page-detalle'>" +
                            this.Nombre + "</a><span hidden='true'>" +
                            this.id + "</span></li>";
            });
			strParaLista += "</ul>";
			str += "</ul>";
            
            
            $('#ftListaLista').append(strParaLista);
            $('#ftListaLista').enhanceWithin();

            $('#ftListaBusq').append(str);
            $('#ftListaBusq').enhanceWithin();

            //$('#ftListaLista').enhanceWithin();
            //$('#ftListaBusq').trigger('create');
            
            //$('#page-Lista').trigger('pagecreate');//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////]
            //('ul').listview('refresh');
            //$('#page-Lista').page('refresh', true);
            
        },
        error: function (x, status, Err) {
            console.log(status + "<br><br>" + x.stsusText + " " + Err);
            console.log("///////////////////////////  E R R O R  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
            alert(" Load Error\n\n\n There was an error loading new data. It could be a problem with your internet connection.\n\n Try again later\n\n\n");
        },
        complete: function () {

            ConnectEvents();
            
            $('#page-Lista').trigger('pagecreate');//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////]
            $('ul').listview();
            
            
            //un peque#ito timer de 1 seg.
            //navigator.splashscreen.hide();
            
            var interval = setInterval(function() {

                //alert('Timer');
                navigator.splashscreen.hide();
                clearInterval(interval);
                
            }, 1);

            
        }
    });
    //alert("LDespues");
}

//function OnPageBShw() {
//    alert('Part 1');
//    if($( ":mobile-pagecontainer" ).pagecontainer("getActivePage" ).attr('id') === 'page-home') {
//        alert('Part 2');
//        navigator.splashscreen.hide();
//    }
//}



function ConnectEvents() {
	//alert("Antes");
    $('a.ftLosListList').on('click', null, null, OnListBusqClick);
    $('a.ftLosListBusq').on('click', null, null, OnListBusqClick);
    $('#SearchIconL').on('click', null, null, OnRefreshClick);
    $('#SearchIconB').on('click', null, null, OnRefreshClick);
    $(document).on('pagecreate', OnPageInit);
    //$(document).on('pagecontainershow', OnPageBShw);
    //alert("Despues");
    
    $(document).on('click', 'a.addInfo', function (e) {
        var timeVar = e.timeStamp;
		if (timeVar !== gTmStmpInit)
        {
        	gNextLoad = "page-bialog";
        	gDialogInfo = $(this).attr("value");
            $.mobile.changePage( "#page-bialog", { transition: "slideup"});
        }
        
        //$('#page-bialog').trigger('pagecreate');
   
    });

}

function OnRefreshClick(e) {
    
    var timeVar = e.timeStamp;
    
    if (timeVar !== gTmStmpInit) {
        
        $('#ftListaLista').empty();
        $('#ftListaBusq').empty();
        gTmStmpInit = timeVar;
        GetRecetas();
        //alert("Si");
	}
}


function OnListBusqClick() {
    gRecetaId = $(this).parent('li.x').children().last().text();
    gRecetaStr = $(this).parent('li.x').children().first().text();

    gNextLoad = "page-detalle";
    //==========================================La instruccion siguiente si hace falta OJO
    $('#page-detalle').trigger('pagecreate'); //===================== I M P O R T A N T E a causa del page caching la Pg. no se rehace. esto la fuerza.

}



function OnPageInit(e) {

    //alert("page-bialog");
    var timeVar = e.timeStamp;
    //gTmStmp
    if (timeVar !== gTmStmpInit) {
        gTmStmpInit = timeVar;


        if (gNextLoad === "page-detalle") {


            gNextLoad = "";
            // *************************************************************** Reset Page
            //alert("page-bialog");
            $('#ftPrep').empty();
            $('#D-Ingredientes').empty();
            $('#lstCompras').empty();
            $('#elInfo').empty();
            $('#acompList').empty();
            $('#porcionesList').empty();
            $('#laFoto').empty();




            $('#HDelDetalle').html(gRecetaStr);

            //#region TheAPI1
            var forUrl = startOfUrl + "preparacion?$filter=LaReceta eq '" + gRecetaId + "'&$orderby=Orden asc",
                str = "";
            $.ajax({            //     ==========AJAX para Preparacion
                url: forUrl,
                headers: {
                    "x-zumo-application": gAppKEY
                },
                dataType: 'json',
                success: function (data) {
                    //var rr = 1;
                    $.each(data, function (index, receta) {
                        var tIsH = this.Heading;

                        if (tIsH) {  //========////// Chequea si es un heading
                            str += "<strong>" + this.Texto + "</strong><br />"; 
                        } else {
                            str += "<p>" + this.Texto + "</p>"; 
                        }

                    });

                    $('#ftPrep').append(str);
                    //$('#ftPrep').html(str);


                },
                error: function (x, status, Err) {
                    console.log(status + "<br><br>" + x.stsusText + " " + Err);
                    console.log("///////////////////////////  E R R O R  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
                }

            });

            //#endregion

            forUrl = startOfUrl + "Ingrediente?$filter=LaReceta%20eq%20'" + gRecetaId + "'&$orderby=Orden asc";
            //var forUrl = startOfUrl + "Ingrediente?$filter=LaReceta%20eq%20'Aqui va la 01'";
            var str2 = "",
                strComp = "";
            $.ajax({   //        ================================= Ajax para Ingredientes
                url: forUrl,
                headers: {
                    "x-zumo-application": gAppKEY
                },
                dataType: 'json',
                success: function (data) {

                    var enH = true;
                    $.each(data, function (index, receta) {
                        var tH = this.Heading,
                            tStr = this.Texto;
                        if (tH) { //========////// Chequea si es un heading
                        
                            if (!enH) {
                                str2 += "</ul><br />";
                            }
                            str2 += "<p><strong>" + tStr + "</strong></p>";
                            enH = true;
                        } else {
                            if (enH) {
                                str2 += "<ul data-role='listview' data-inset='true' data-split-icon='info'>";
                                enH = false;
                            }

                            var ovrrTxt = this.OvrrTexto,
                                present = this.Presentacion,
                                cnt = this.Cantidad,
                                ingr = "",

                                mUpToAdd = "";
                            
                            if (this.InfoAdl) {
                                ginfoArrForDialog[ginfoArrForDialog.length] = {
                                    id: this.id,
                                    info: this.InfoAdl
                                };


                                mUpToAdd = "<a href='#' class='addInfo' data-rel='dialog' " +
                                            "data-transition='slidedown' value= '" + this.id + "'></a>";
                            }
                            if (ovrrTxt) {
                                ingr = ovrrTxt;
                                mUpToAdd = "<a href='#'></a>";
                                str2 += "<li><a href='#'><p>" + ingr + "</p></a></li>";
                            } else {
                                if (present) {
                                    ingr = cnt + " " + present + " de " + tStr;
                                    str2 += "<li><a href='#'><p>" + ingr + "</p></a>" + mUpToAdd + "</li>";
                                } else {
                                    ingr = cnt + " " + tStr;
                                    str2 += "<li><a href='#'><p>" + ingr + "</p></a>" + mUpToAdd + "</li>";
                                }
                            }
                            //Aqui   lstCompras
                            var cmpTexto = this.CompraTxt;
                            
                            if (!cmpTexto) {
                                strComp += "<label><input type='checkbox' />" + ingr + "</label>";
                            } else {
                                if (!(cmpTexto === 'no' ||cmpTexto === 'No' ||cmpTexto === 'NO' )) {
                                    strComp += "<label><input type='checkbox' />" + cmpTexto + "</label>";
                                }
                                
                            }

                        }

                    });

                    str2 += "</ul><br />";
                    $('#D-Ingredientes').append(str2).trigger('create');
                    $('#lstCompras').append(strComp).trigger('create');


                },
                error: function (x, status, Err) {
                    console.log(status + "<br><br>" + x.stsusText + " " + Err);
                    console.log("///////////////////////////  E R R O R  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
                },
                complete: function () {
                    //ConnectEvents();
                }

            });



            forUrl = startOfUrl + 'Receta/' + gRecetaId;
            var strInfo = "",
                strAcomp = "",
                strPorc = "",
                strFoto = "";
            
            $.ajax({   //        ================================= Ajax para UNA Receta
                url: forUrl,
                headers: {
                    "x-zumo-application": gAppKEY
                },
                dataType: 'json',
                success: function (data) {


                    if (data.Info) {strInfo = "<p>" + data.Info + "</p>"; }
                    if (data.Acomp) {strAcomp = "<p>" + data.Acomp + "</p>"; }
                    if (data.Raciones) {strPorc = "<p>Da para " + data.Raciones + " raciones.</p>"; }
                    if (data.FotoPpal) {strFoto = "<img id='laImg' src='" + data.FotoPpal + "' alt='" + data.Nombre + "' width='300' />"; }

                    $('#elInfo').append(strInfo).trigger('create');
                    $('#acompList').append(strAcomp).trigger('create');
                    $('#porcionesList').append(strPorc).trigger('create');
                    $('#laFoto').append(strFoto).trigger('create');



                },
                error: function (x, status, Err) {
                    console.log(status + "<br><br>" + x.stsusText + " " + Err);
                    console.log("///////////////////////////  E R R O R  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
                }

            });

        }
        if (gNextLoad === "page-bialog") {
            gNextLoad = "";

            $('#dialogContent').empty();
            var tpStr = "";
            for (var i = 0; i < ginfoArrForDialog.length; i++) {
                if (ginfoArrForDialog[i].id === gDialogInfo) {
                    tpStr = ginfoArrForDialog[i].info;
                }
            }
            tpStr = "<p>" + tpStr + "</p>";
            $('#dialogContent').append(tpStr).trigger('create');
        }
        if (gNextLoad === "page-Lista") {
            gNextLoad = "";
            //$('#page-Lista').trigger('pagecreate');//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
        }
    }
}