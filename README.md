# Fluig
Repositório para armazenamento código utilizado no dia a dia

<h4>Função para pegar a data de aprovação da atividade</h4>

```
function dataAprovacaoUGPDes(data, type, row, meta){
	var solicitacaoID = row["SOLICITACAO"];
	
	try{
		
		if(solicitacaoID != null){

			var c0 = DatasetFactory.createConstraint('processHistoryPK.companyId', '1', '1', ConstraintType.MUST); //Filtro por Código da empresa.
			var c1 = DatasetFactory.createConstraint('processHistoryPK.processInstanceId', solicitacaoID, solicitacaoID, ConstraintType.MUST); //Filtro por Número da solicitação.
			var c2 = DatasetFactory.createConstraint('stateSequence', '167', '167', ConstraintType.MUST); //Filtro por Código da atividade que foi movimentada.

			var colunasHistory = new Array('processHistoryPK.movementSequence'); //Coluna quantidade de movimentações da solicitação

			var ordenacao =  new Array("processHistoryPK.movementSequence;desc"); //Ordena por quantidade de movimentações da solicitação

			var datasetProcessHistory = DatasetFactory.getDataset('processHistory', colunasHistory , new Array(c0, c1, c2), ordenacao);
			
			if(datasetProcessHistory['values'] != ''){
				
				var ultimaSequencia = datasetProcessHistory['values'][0]['processHistoryPK.movementSequence']
	
	
				var c0 = DatasetFactory.createConstraint('processTaskPK.companyId', '1', '1', ConstraintType.MUST);
				var c1 = DatasetFactory.createConstraint('processTaskPK.processInstanceId', solicitacaoID, solicitacaoID, ConstraintType.MUST);
				var c2 = DatasetFactory.createConstraint('processTaskPK.movementSequence', ultimaSequencia, ultimaSequencia, ConstraintType.MUST);
				var colunasTask = new Array('endDate');
	
				var datasetProcessTask = DatasetFactory.getDataset('processTask', colunasTask, new Array(c0, c1, c2), null);
				
				if(datasetProcessTask['values'][0]['endDate'] != null){
				    for(var i = 0; i< datasetProcessTask.values.length; i++){ //preenchendo e conversão da data
				    	var tempo = datasetProcessTask['values'][0]['endDate'] //Data em milisegundo
				    	date = new Date(tempo); //Converte para 'Thu Feb 24 2022 12:41:57 GMT-0300 (Horário Padrão de Brasília)'
				    	dateFormated =  new Intl.DateTimeFormat('pt-BR').format(date) //Converte para 24/02/2022
				    	
					}
//			console.log(dateFormated);
				return dateFormated
			    
				}else{
					return " "
				}
			}else{
				return " "
			}
		}else{
			return " "
		}
		

	}catch(e){
		console.log("erro ao pegar meta")
	}
}
```

Query para retornar a data de aprovação

```
SELECT NVL(TO_CHAR(PROCES.END_DATE,'DD/MM/YYYY', 'nls_date_language = PORTUGUESE'), ' ') AS DATAAPROV
FROM TAR_PROCES PROCES 
WHERE PROCES.NUM_PROCES = '26266' AND PROCES.NUM_SEQ_MOVTO = (SELECT SUM(MAX(PROCESC.NUM_SEQ_MOVTO)+1) 
FROM TAR_PROCES PROCESC 
WHERE PROCESC.NUM_SEQ_ESCOLHID = 10 AND PROCESC.NUM_PROCES = PROCES.NUM_PROCES 
GROUP BY PROCESC.NUM_PROCES)
```
                                  
                             
