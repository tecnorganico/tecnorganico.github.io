// código elaborado por https://github.com/GuiiMoraes confira o original em https://codepen.io/guiimoraes/pen/JjPRmvm
function comoChama() {
  event.preventDefault();
  console.log("phe");
  const name = document.querySelector(".pergunta").value;
  console.log(name);  
	document.querySelector(".resposta").textContent = `então ${name}, queria ver meus projetos? por enquanto tenho nenhum mas tô rápido igual Bolt, logo mais tem coisa`;
}
// gostou? alguma sugestão? fala comigo!