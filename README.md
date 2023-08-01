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

<h4>Query para retornar a data de aprovação da atividade</h4>

```
SELECT NVL(TO_CHAR(PROCES.END_DATE,'DD/MM/YYYY', 'nls_date_language = PORTUGUESE'), ' ') AS DATAAPROV
FROM TAR_PROCES PROCES 
WHERE PROCES.NUM_PROCES = '26266' AND PROCES.NUM_SEQ_MOVTO = (SELECT SUM(MAX(PROCESC.NUM_SEQ_MOVTO)+1) 
FROM TAR_PROCES PROCESC 
WHERE PROCESC.NUM_SEQ_ESCOLHID = 10 AND PROCESC.NUM_PROCES = PROCES.NUM_PROCES 
GROUP BY PROCESC.NUM_PROCES)
```

<h4>Atualizar responsável pela atividade</h4>

```
UPDATE TAR_PROCES
SET CD_MATRICULA = '7403652' 
WHERE NUM_PROCES = '41761' AND NUM_SEQ_MOVTO = '12'
```

<h4>Tabelas</h4>

```
EVENT_FICHA - Eventos dos formulários
EVENT_PROCES - Eventos dos processos
PROCES_WORKFLOW - Processos 
FDN_USERTENANT e FDN_USER - Usuários
TAR_PROCES - Responsável Processo
```

<h4>Verificar usuários ativos e bloqueados</h4>

```
SELECT * FROM FDN_USERTENANT WHERE USER_STATE = '1' --Ativos
SELECT * FROM FDN_USERTENANT WHERE USER_STATE = '2' --Bloquados
```

<h4>Resetar senha WCMADMIN</h4>

```
select *  
from fdn_usertenant  
where LOGIN = 'wcmadmin' 
and password = HASHBYTES('md5','adm')

UPDATE fdn_usertenant SET password='b09c600fddc573f117449b3723f23d64' WHERE login='wcmadmin'
```

<h4>Função para retorna a quantidade de dias entre as data</h4>

```       
function validarData(dataInicio, dataFim){
	const dateI = dataInicio; // dd/mm/yyyy
	const dateF = dataFim; // dd/mm/yyyy

	const [day, month, year] = dateI.split('/');
	const result = [year, month, day].join('-');
	
	const [day1, month1, year1] = dateF.split('/');
	const result1 = [year1, month1, day1].join('-');
	
	// 👉️ cálculo do nº. de dias entre duas datas  
	// Para definir duas datas para duas variáveis
	var date1 = new Date(result); // yyyy-mm-dd
	var date2 = new Date(result1);// yyyy-mm-dd
	  
	// Para calcular a diferença horária de duas datas
	var Difference_In_Time = date2.getTime() - date1.getTime();
	  
	// Para calcular o nº. de dias entre duas datas
	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
	  
	//Para exibir o nº final. de dias (resultado)
	if(Difference_In_Days >= 100){
		alert("***Existe mais de 100 dias no filtro: "+Difference_In_Days+" dias.***");
		window.location.reload(false);
	}
	
}
```

<a href="https://github.com/PatrickCavalcant/Fluig/tree/main/E-mail%20Customizado"><h4>E-mail Customizado</h4></a>
<p align="center">
    <img src="E-mail Customizado/email.png">
</p>

<h4>Chamada AJAX para consumir API Fluig</h4>
 Consultar API do Fluig de usuários substitutos - https://{endereço}/api/resource_SubstituteUserServiceRest.html
 
```
function obterUsuarioSubstituto(){
	var companyId = "1";  //Empresa
	var userId = "7403470"; //Usuário
	
	for (j = 1; j <= indexsTableComissao.length; j++) {	
		
		$.ajax({
			url: "/api/public/bpm/substituteUser/getSubstitutesOfUser/"+companyId+"/"+userId,		
			async : false,
			method:"GET",
			success: function(data) {
				console.log(data); 
				},error: function() {
					console.log("erro");  
				},
			});
	}
}
```

<h4>Trabalhando com Constraints</h4>

```
//Seleciona as colunas 
DatasetFactory.getDataset("DATASET", colunas, filtro, ordenacao);

//Consulta de Dataset via Browser no console 
var colunas =  new Array("publisherId","documentDescription","documentType"); 
DatasetFactory.getDataset("document", colunas, null, null);

//Criação dos filtros 
var colunas =  new Array("publisherId","documentDescription","documentType"); 
var filtro_1 = DatasetFactory.createConstraint("documentType", 1, 1, ConstraintType.MUST);

var filtros = new Array(filtro_1); 
DatasetFactory.getDataset("document", colunas, filtros, null);

//Criação do filtro 2 
var colunas =  new Array("publisherId","documentDescription","documentType"); 
var filtro_1 = DatasetFactory.createConstraint("documentType", 4, 4, ConstraintType.MUST); 
var filtro_2 = DatasetFactory.createConstraint("documentDescription", "Form02", "Form02", ConstraintType.MUST);

var filtros = new Array(filtro_1, filtro_2);
DatasetFactory.getDataset("document", colunas, filtros, null);

//Ordenação da consulta - Ascendente 
var colunas =  new Array("publisherId","documentDescription","documentType"); 
var filtro_1 = DatasetFactory.createConstraint("documentType", 4, 4, ConstraintType.MUST);

var ordenacao =  new Array("documentDescription;asc");

var filtros = new Array(filtro_1); 
DatasetFactory.getDataset("document", colunas, filtros, ordenacao);

//Ordenação da consulta - Descendente 
var colunas =  new Array("publisherId","documentDescription","documentType"); 
var filtro_1 = DatasetFactory.createConstraint("documentType", 4, 4, ConstraintType.MUST);

var ordenacao =  new Array("documentDescription;desc");

var filtros = new Array(filtro_1); 
DatasetFactory.getDataset("document", colunas, filtros, ordenacao);
```


<h4>Localizar tabela do formulário</h4>
Dataset 'document' 
Filtrar pelo 'documentPK.documentid', sendo ele o código da pasta
Pega o número do 'metalistId', sendo adicionado ao final
ML + 001 = Cód Empresa + 048 = metalistId
ML001042

Ou 

```
select owner, table_name, column_name 
from all_tab_columns 
where column_name in ('txtSituacao')

```
txtSituacao = Campo do Formulário
