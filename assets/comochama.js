// código elaborado por https://github.com/GuiiMoraes confira o original em https://codepen.io/guiimoraes/pen/JjPRmvm
function comoChama() {
  event.preventDefault();
  console.log("phe");
  const name = document.querySelector(".pergunta").value;
  console.log(name);  
	document.querySelector(".resposta").textContent = `${name}, tem algmas coisas minhas nos endereços abaixo, vai no botão de gatinho`;
}
// gostou? alguma sugestão? fala comigo!