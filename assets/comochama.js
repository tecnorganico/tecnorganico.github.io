// código elaborado por https://github.com/GuiiMoraes confira o original em https://codepen.io/guiimoraes/pen/JjPRmvm
function comoChama() {
  event.preventDefault();
  console.log("phe");
  const name = document.querySelector(".pergunta").value;
  console.log(name);  
	document.querySelector(".resposta").textContent = `${name}, tem algumas coisas minhas abaixo, fica à vontade`;
}
// gostou? alguma sugestão? fala comigo!