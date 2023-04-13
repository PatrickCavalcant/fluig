function defineStructure() {
    addColumn("NUM");
    addColumn("STATUS");
    addColumn("LASTSYNC");
    setKey([ "NUM"]);
    addIndex([ "NUM"]);
}
function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();
	var cod_empresa = getValue("WKCompany");
	// Dataset 
	//var ds_mov = DatasetFactory.getDataset('ds_cancelamento_automatizado', null, null, null);
	var limit = 50;
	
	// Query de busca das solicitações em aberto
	var queryBuscaSolicitacoes = "SELECT W.NUM_PROCES, w.START_DATE FROM proces_workflow w INNER JOIN histor_proces h ON w.COD_EMPRESA = h.COD_EMPRESA AND w.NUM_PROCES = h.NUM_PROCES WHERE w.COD_DEF_PROCES = 'Movimentação de Pessoal' AND w.status = 0 AND h.log_ativ = 1 AND w.START_DATE < to_date('2021/12/31 23:59:59', 'YYYY/MM/DD HH24:MI:SS') AND h.NUM_SEQ_ESTADO <> 141";
	var ds_abertos = select(queryBuscaSolicitacoes);

	if(ds_abertos != null)
	log.info("Cancelamento de Solicitações - ds_suporte_mov_solicitacoes - ds_abertos:"+ds_abertos.length);
	

	for(var x=0; x<ds_abertos.length;x++){
		var solicitacao = ds_abertos[x]["NUM_PROCES"];
		var achou = false;
		var csCancelamento = [];
		csCancelamento.push(DatasetFactory.createConstraint("NUM",solicitacao, solicitacao, ConstraintType.MUST));
		var cancelamento = DatasetFactory.getDataset('ds_cancelamento_automatizado', null, csCancelamento, null);
		if(cancelamento == null || (cancelamento != null && cancelamento.rowsCount==0)){
			var retorno = cancelaMovimenacao(solicitacao, cod_empresa);
			dataset.addRow(new Array(solicitacao, retorno, dataAtualFormatada(lastSyncDate)));	
		};
		if(x == limit-1){
			break;
		}
	}
	return dataset;
}

// Chamada do Webservice para cancelamento
function cancelaMovimenacao(numSolicitacao, cod_empresa){
	log.info("Cancelando a solicitação:"+numSolicitacao)
	// Obtém a instância do serviço 'WorkflowEngineService'
	var workflowEngineServiceProvider = ServiceManager.getServiceInstance("ECMWorkflowEngineService"); // Serviço de ECMWorkflowEngineService
	
	// Instancia o serviço
	var workflowEngineServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
	var workflowEngineService = workflowEngineServiceLocator.getWorkflowEngineServicePort();
	return workflowEngineService.cancelInstance("Admin", // E-MAIL GESTOR DO FLUXO
												"TESTE", // SENHA GESTOR DO FLUXO
												1, // ID EMPRESA
											   	parseInt(numSolicitacao),
											   	"7403652", // MATRICULA GESTOR DO FLUXO
											   	"Cancelamento automatizado da solicitação. Ticket #15314768"); // DESCRIÇÃO DO CANCELAMENTO

}

function createDataset(fields, constraints, sortFields) {
	
}
function onMobileSync(user) {
}

function dataAtualFormatada(timestamp){
    var data = new Date(timestamp),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
        horaF = data.getHours();
        minF = data.getMinutes();
        secF = data.getSeconds();
    return diaF+"/"+mesF+"/"+anoF+" "+horaF+":"+minF+":"+secF;
}

function select(query){
	try {
		log.info("SELECT QUERY: "+query);
		var dataSource = "jdbc/AppDS";       
		
		var ic = new javax.naming.InitialContext();
		var ds = ic.lookup(dataSource);
		var conn = ds.getConnection();
		var stmt = conn.createStatement();
		var created = false;
		var rs = stmt.executeQuery(query);
		var columnCount = rs.getMetaData().getColumnCount();
		var retorno = [];
		var colunas = [];
		while(rs.next()) {
			var objetoRetorno = {};
			if(!created) {
				for(var i=1;i<=columnCount; i++) {
					colunas.push(rs.getMetaData().getColumnName(i));
				}
				created = true;
			}
			log.dir(colunas);
			for(var i=1;i<=columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnName(i));
				if(null!=obj){
					objetoRetorno[colunas[i-1]] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
				}
				else {
					objetoRetorno[colunas[i-1]] = "null";
				}
			}
			retorno.push(objetoRetorno);
		}
		return retorno;
	} catch(e) {
		log.error("DATASET_SQL_ERRO_SELECT==============> " + e.message);
		throw e;
	} finally {
		if(stmt != null) stmt.close();
		if(conn != null) conn.close();		
	}
}
