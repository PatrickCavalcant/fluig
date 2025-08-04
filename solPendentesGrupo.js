var c0 = DatasetFactory.createConstraint('workflowProcessPK.companyId', '1', '1', ConstraintType.MUST); //Filtro por Código da empresa.
var c1 = DatasetFactory.createConstraint('status', '0', '0', ConstraintType.MUST); //Filtro por solicitações abertas.

var colunasWorkflow = new Array('workflowProcessPK.processInstanceId', 'status');

var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', colunasWorkflow, new Array(c0, c1), null);

var solicitacao = new Array();

for (var x = 0; x < datasetWorkflowProcess.values.length; x++) {
	
	solicitacaoID = datasetWorkflowProcess.values[x]['workflowProcessPK.processInstanceId'];
	var a0 = DatasetFactory.createConstraint('status', '2', '2', ConstraintType.MUST);
	var a1 = DatasetFactory.createConstraint('processTaskPK.processInstanceId', solicitacaoID, solicitacaoID, ConstraintType.MUST);


	var colunasTask = new Array('choosedColleagueId', 'processTaskPK.processInstanceId');

	var datasetProcessTask = DatasetFactory.getDataset('processTask', colunasTask, new Array(a0, a1), null);
	
	solicitacao.push(datasetProcessTask.values[datasetProcessTask.values.length-1])
	
}

const filtrado = solicitacao.filter(item => 
  item?.choosedColleagueId?.startsWith("Pool:Group")
);

console.log(filtrado);


	
