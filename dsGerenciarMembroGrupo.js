/**
 * dsGerenciarMembroGrupo
 * Adiciona ou remove um funcionário de um grupo
 * @param acao: adicionar || remover
 * @param idGrupo
 * @param chapa
 * @autor Rafael Luz
 */
function defineStructure() {}
function onSync(lastSyncDate) {}
function onMobileSync(user) {}

function createDataset(fields, constraints, sortFields) {

	try {
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('retorno');

		/**
		 * VALIDAR PARÂMETROS
		 */
	   	var acao = '';
	   	var idGrupo = '';
	   	var chapa = '';

	   	if(constraints != null && constraints !== undefined && constraints != "") {
			for (var i = 0; i < constraints.length; i++) {
			    if(constraints[i].fieldName == 'acao') { acao = constraints[i].initialValue; }
			    if(constraints[i].fieldName == 'idGrupo') { idGrupo = constraints[i].initialValue; }
			    if(constraints[i].fieldName == 'chapa') { chapa = constraints[i].initialValue; }
			}
		}

		if(acao == '' || idGrupo == '' || chapa == '') {
			throw 'Parâmetros inválidos.';
		}

		//USUÁRIO ADMIN
		var dsConnector = DatasetFactory.getDataset('dsConnector', null, null, null);
		var userLogin = dsConnector.getValue(0, "fUser");
		var userPassword = dsConnector.getValue(0, "fSenha");

		//SERVIÇO
		var serviceManager = ServiceManager.getService("ECMColleagueGroupService");
		var wsLocator  = serviceManager.instantiate("com.totvs.technology.ecm.foundation.ws.ECMColleagueGroupServiceService");
		var colleagueGroupService = wsLocator.getColleagueGroupServicePort();

		var retornoServico = '';

		//ADICIONAR
		if(acao == 'adicionar') {
			//INSTANCIAR OBJETOS DA CLASSE
			var colleagueGroupDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueGroupDtoArray");
			var colleagueGroupDto = serviceManager.instantiate("com.totvs.technology.ecm.foundation.ws.ColleagueGroupDto");

			//SETAR VALORES NO OBJETO
			colleagueGroupDto.setColleagueId(chapa);
			colleagueGroupDto.setGroupId(idGrupo);
			colleagueGroupDto.setCompanyId("1");

			colleagueGroupDtoArray.getItem().add(colleagueGroupDto);

			//EXECUTAR SERVIÇO
			retornoServico = colleagueGroupService.createColleagueGroup(userLogin, userPassword, 1, colleagueGroupDtoArray);
		}
		//REMOVER
		else if(acao == 'remover') {
			retornoServico = colleagueGroupService.deleteColleagueGroup(userLogin, userPassword, 1, idGrupo, chapa);
		}
		else {
			throw 'Ação inválida.';
		}

		//RETORNO
		if(retornoServico == "ok") {
			dataset.addRow([true]);
		}
		else {
			throw retornoServico;
		}


		return dataset;

	} catch(e) {
		dataset.addColumn('erro');
		dataset.addRow([false, 'Erro: ' + e.toString()]);
		return dataset;
	}

}