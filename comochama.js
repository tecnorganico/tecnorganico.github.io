/*Função que adicionará o que foi escrito no input
para uma lista ordenada, caso nada for escrito, pedirá uma tarefa*/

function comoChama() {

	var item = document.getElementById("mechamo").value + ", queria ver meus projetos? por enquanto tenho nenhum mas tô rápido igual Bolt, logo mais tem coisa";
	var text = document.createTextNode(item);
	var newItem = document.createElement("name");
	newItem.appendChild(text);
	document.getElementById("comoChama").appendChild(newItem);
	document.getElementsById("mechamo").remove();

}
