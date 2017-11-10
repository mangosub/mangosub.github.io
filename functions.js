function tick_click(){
    change_text("");
    change_tick_image();
}

function change_text(id){
	document.getElementById("sub_text_generate").innerHTML = document.getElementById("sub_text_input_generate".concat(id)).value;
}
function change_tick_image(){
	document.getElementById("tick").src = "images/check_selected.png";
}
function select_subs(id){
	change_text("_".concat(id));
	document.getElementById("tick_1").src = "images/check_unselected.png";
	document.getElementById("tick_2").src = "images/check_unselected.png";
	document.getElementById("tick_3").src = "images/check_unselected.png";

	document.getElementById("tick_".concat(id)).src = "images/check_selected.png";
}
function generate_sub(){
	document.getElementById("sub_text_generate").innerHTML = document.getElementById("sub_text_input_generate").value
}
function random_work() {
	var x = Math.floor((Math.random() * 3) + 1);

	if (x === 1) {
		location.href = "generate_info.html"
	}
	else if (x === 2) {
		location.href = "fix_info.html"
	}
	else if (x === 3) {
		location.href = "verify_info.html"
	}
}