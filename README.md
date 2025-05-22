# Fluig
[![author](https://img.shields.io/badge/author-patrick-red.svg)](https://www.linkedin.com/in/patrick-cavalcante-moraes-a95635179/) 
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/PatrickCavalcant)

Repositório para armazenamento de código utilizado no dia a dia

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
WCM_PAGE - Páginas
FDN_GROUPUSERROLE - Grupos
DOCUMENTO - Tabela que controla a versão ativa de um dataset de formulário

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

//Contar a quantidade de registros
var dataset = DatasetFactory.getDataset("document", colunas, filtros, ordenacao); 
var rowsCount = dataset.values.length; 
rowsCount
```


<h4>Localizar tabela do formulário</h4>
Dataset 'document' <br/>
Filtrar pelo 'documentPK.documentid', sendo ele o código da pasta.<br/>
Pega o número do 'metalistId', sendo adicionado ao final.<br/>
ML + 001 = Cód Empresa + 048 = metalistId<br/>
ML001042<br/>

<hr/>

```
select owner, table_name, column_name 
from all_tab_columns 
where column_name in ('txtSituacao')

```
txtSituacao = Campo do Formulário

<hr/>

```
SELECT TABLE_NAME FROM information_schema.columns WHERE column_name like '%NOMECAMPOFORM%'
```

<hr/>

```
SELECT 
case when len(CONVERT(VARCHAR(MAX) , d.COD_LISTA)) <=3 then 'ML00' + CONVERT(char(1),d.COD_EMPRESA)+replicate('0',3- len(CONVERT(VARCHAR(MAX) , d.COD_LISTA) )) +  CONVERT(VARCHAR(MAX) , d.COD_LISTA) 
     else 'ML00' + CONVERT(char(1),d.COD_EMPRESA)+CONVERT(VARCHAR(MAX) , d.COD_LISTA) 
end as tabela     
,*  FROM DOCUMENTO d where d.VERSAO_ATIVA =1 and DS_PRINCIPAL_DOCUMENTO ='[nome form]'
```
Pega a ML principal

```
SELECT LISTA_FILHO.COD_TABELA,
case when   len(CONVERT(VARCHAR(MAX) , COD_LISTA_FILHO)) <=3 then  'ML00' + CONVERT(char(1), LISTA_FILHO.COD_EMPRESA)+replicate('0',3- len(CONVERT(VARCHAR(MAX) , COD_LISTA_FILHO) ))+CONVERT(VARCHAR(MAX) , COD_LISTA_FILHO) 
     else 'ML00' + CONVERT(char(1), LISTA_FILHO.COD_EMPRESA)+CONVERT(VARCHAR(MAX) , COD_LISTA_FILHO) 
     end as TABELA    
FROM 
	META_LISTA_REL LISTA_FILHO 
WHERE  
	LISTA_FILHO.COD_EMPRESA = 1 
	AND LISTA_FILHO.COD_LISTA_PAI  = (SELECT COD_LISTA FROM DOCUMENTO d where d.VERSAO_ATIVA =1 and DS_PRINCIPAL_DOCUMENTO ='[nome form ]' )
```

Pega a ML Filha, quando são os paixfilho

```
SELECT 
'ML001' + CONVERT(CHAR(10), l.COD_LISTA_PAI)  AS 'TABELA_PRINCIPAL', 
'ML001' + CONVERT(CHAR(10), l.COD_LISTA_FILHO)  AS 'TABELA_PAIxFILHO', 
d.COD_LISTA, 
l.COD_LISTA_PAI, 
l.COD_LISTA_FILHO, 
l.COD_TABELA, 
d.NUM_DOCTO_PROPRIED, 
d.NUM_VERS_PROPRIED 
FROM DEF_PROCES p " 
LEFT JOIN VERS_DEF_PROCES vp ON vp.COD_DEF_PROCES = p.COD_DEF_PROCES AND vp.LOG_ATIV = 1 "
LEFT JOIN DOCUMENTO d ON d.NR_DOCUMENTO = vp.NUM_PASTA_FORM AND d.VERSAO_ATIVA = 1 
LEFT JOIN SERV_DATASET ds ON ds.COD_DATASET = d.NM_DATASET 
LEFT JOIN META_LISTA_REL l ON l.COD_LISTA_PAI = d.COD_LISTA 
WHERE p.COD_DEF_PROCES = 'wf_programa_acao_avaliacao' OR ds.COD_DATASET = '' 
ORDER BY vp.NUM_VERS DESC
```

<br/>

<h4>Último acesso de usuário</h4>

```
SELECT 
   FDN_USERTENANT.LOGIN,  
   	CASE 
   		FDN_USERTENANT.USER_STATE 
   		WHEN 2 THEN 'Inativo' 
   		WHEN 1 THEN 'Ativo' 
   		ELSE '' 
   		END AS STATUS, 	
   	
   	MAX(ACCESS_DATE) ULTIMO_ACESSO 
   	
   	
FROM FDN_USER
INNER JOIN FDN_USERTENANT ON FDN_USERTENANT.USER_ID = FDN_USER.USER_ID
INNER JOIN FDN_ACCESSLOG ON FDN_ACCESSLOG.LOGIN=FDN_USERTENANT.LOGIN
WHERE
	FDN_USERTENANT.LOGIN NOT IN ('wcmadmin')


GROUP BY FDN_USERTENANT.LOGIN , USER_STATE
```

Alterar tamanho da coluna do banco oracle

```
SELECT * FROM FLUIG.ML001024
DESCRIBE FLUIG.ML001024;

ALTER TABLE FLUIG.ML001024
MODIFY SITE  VARCHAR2(4000);
```

Ocultar páginas do menu lateral

```
UPDATE  WCM_PAGE SET HIDDEN='true' WHERE PAGE_COD = 'Código da Página'
```

Tarefas Atrasadas

```
SELECT 
DATE_FORMAT(DEADLINE, '%d-%m-%Y') DEADLINE, 
DATE_FORMAT(w.END_DATE, '%d-%m-%Y') ENDDATE, 
DATE_FORMAT(w.START_DATE, '%d-%m-%Y') STARTDATE, 
w.COD_DEF_PROCES 
from TAR_PROCES t join PROCES_WORKFLOW w on t.NUM_PROCES = w.NUM_PROCES 
where t.LOG_ATIV = 1 
and t.deadline < sysdate(3)
```

Controla a versão do formulário
```
Tabela - DOCUMENTO
Campo - NUM_VERS_PROPRIED
NUM_DOCTO_PROPRIED - Código da Pasta
NR_DOCUMENTO - Código do Fomulário
```

