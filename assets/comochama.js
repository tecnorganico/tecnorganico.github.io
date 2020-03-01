// código elaborado por https://github.com/GuiiMoraes confira o original em https://codepen.io/guiimoraes/pen/JjPRmvm
function comoChama() {
  event.preventDefault();
  name = document.querySelector(".pergunta").value;
  if (name == false) { // false entende que uma string vazia é falso poderia também ser '' no lugar de false
    name = "Cibernauta";
    document.querySelector(".hidden").style.display = "block";
  } else {
    document.querySelector(".resposta").textContent = `${name}`
    document.querySelector(".hidden").style.display = "block";
    document.querySelector(".hidden").style.transition = "all 2s";
  }
}
// gostou? alguma sugestão? fala comigo!