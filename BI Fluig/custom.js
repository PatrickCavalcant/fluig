
/**
 * Cria o grafico de barra selecionando os elementos HTML correspondentes ao 
 * valor do indicador e à barra do indicador usando a função "querySelector".
 * @author Patrick Cavalcante
 */
let indicatorValue = document.querySelector('.indicator-value');
let indicatorBar = document.querySelector('.indicator-bar');

function updateIndicator(value) {
  indicatorValue.innerHTML = `${value}%`;
  indicatorBar.style.width = `${value}%`;
}

//Chamada do gráfico passando o valor no argumento. 
updateIndicator(85);


/**
 * Cria o grafico de pizzas
 * @author Patrick Cavalcante
 */
// Dados para o gráfico de pizzas
const dataPieChart = {
  labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'],
  datasets: [
    {
      data: [30, 20, 40, 10],
      backgroundColor: ['#FF4500', '#FF0000', '#0000FF', '#00FF00']
    }
  ]
};

// Opções para o gráfico de pizzas
const optionsPieChart = {
  responsive: true,
  legend: {
    position: 'top'
  }
};

// Obtém o contexto do canvas
const ctxPieChart = document.getElementById('pieChart').getContext('2d');

// Cria o gráfico de pizzas
const pieChart = new Chart(ctxPieChart, {
  type: 'pie',
  data: dataPieChart,
  options: optionsPieChart
});


/**
 * Cria o grafico de barras
 * @author Patrick Cavalcante
 */
// Dados para o gráfico de barras
const dataBarChart = {
  labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'],
  datasets: [
    {
      label: 'Dados 1',
      data: [30, 20, 40, 10],
      backgroundColor: '#00FF00'
    },
    {
      label: 'Dados 2',
      data: [10, 40, 30, 20],
      backgroundColor: '#FF0000'
    }
  ]
};

// Opções para o gráfico de barras
const optionsBarChart = {
  responsive: true,
  legend: {
    position: 'top'
  }
};

// Obtém o contexto do canvas
const ctxBarChart = document.getElementById('barChart').getContext('2d');

// Cria o gráfico de barras
const barChart = new Chart(ctxBarChart, {
  type: 'bar',
  data: dataBarChart,
  options: optionsBarChart
});


/**
 * Cria o grafico de linhas
 * @author Patrick Cavalcante
 */
// Dados para o gráfico de linhas
const data = {
  labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
  datasets: [
    {
      label: 'Dados 1',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: '#FF0000',
      borderWidth: 1
    },
    {
      label: 'Dados 2',
      data: [28, 48, 40, 19, 86, 27],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: '#0000FF',
      borderWidth: 1
    }
  ]
};

// Opções para o gráfico de linhas
const options = {
  responsive: true,
  legend: {
    position: 'top'
  }
};

// Obtém o contexto do canvas
const ctx = document.getElementById('lineChart').getContext('2d');

// Cria o gráfico de linhas
const lineChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options
});