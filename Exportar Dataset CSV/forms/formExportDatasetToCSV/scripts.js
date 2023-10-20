/*
 *Exporta Dataset do Fluig em CSV
 *Autor: RenatoAvellar * λ
 * 
*/

// Monta o 'corpo' do arquivo CSV
function geraCSV( dataset ){

    var dados = dataset.values;
    var colunas = dataset.columns;
    console.log(colunas);

    var array = typeof dados != 'object' ? JSON.parse(dados) : dados;
    var str = '';
    var lin = '';

    for (var c = 0; c < colunas.length; c++) {
        lin += colunas[c] + ";";
    }
    str += lin + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var c=0; c<colunas.length; c++) {
            if (line != '') line += ';'

            line += array[i][colunas[c]];
        }

        str += line + '\r\n';
    }

    return str;
}

// Consulta o dataset e gera um link para download do arquivo CSV montado pela geraCSV
function exportCSV(){
	var codDs = $('#codDataset').val();
	var ds = DatasetFactory.getDataset(codDs, null, null, null);
	
	if(ds.values <= 0 || ds.values == undefined){
		exibirMensagem("","Dataset não encontrado", "warning");
		return false;
	} else {
		var csvString = geraCSV(ds);
		var universalBOM = "\uFEFF";
		var a = window.document.createElement('a');
		a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString));
		a.setAttribute('download', 'ExportDataset_'+ codDs +'.csv');
		window.document.body.appendChild(a);
		a.click();

		return true;
	}
}

function exibirMensagem(titulo, mensagem, tipo){
	// tipos:
	//  - danger
	//  - warning
	//  - success
	//  - info
	if ((tipo == null) || (tipo == undefined) || tipo == ""){
		tipo = "info";
	} // if
	FLUIGC.toast({
		title: titulo,
		message: mensagem,
		type: tipo
	}); // toast
} // exibirMensagem