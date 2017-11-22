var loaded = false;
var gs_time;
var ge_time;
var ran_int;
function tick_click(){
    submit_generate()
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
	submit_generate();
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
function set_slider_limits(){
	var vid = document.getElementById('video_player');
	var vid_dur = vid.duration;
}

function submit_fix(){
	var text = document.getElementById("sub_text_input_generate").value;
	var dbRef = firebase.database().ref().child('subtitles').child('id').child("gen_times").child(ran_int);
	dbRef.once("value", function(snapshot){
		if (gs_time !== undefined) {
			dbRef.set({
				"text": text,
				"s_time": gs_time,
				"e_time": ge_time,
				});
			document.getElementById('id01').style.display='block';
		}
		else{
			alert("Please, test your subtitle buy clicking on 'Show'");
		}
	});
	

}
function submit(){
	var text = document.getElementById("sub_text_input_generate").value;
	var dbRef = firebase.database().ref().child('subtitles').child('id').child("gen_times");
	dbRef.once("value", function(snapshot){
		var new_child = dbRef.child(String(snapshot.numChildren()+1));
		if (gs_time !== undefined) {
			new_child.set({
				"text": text,
				"s_time": gs_time,
				"e_time": ge_time,
				});
			document.getElementById('id01').style.display='block';
		}
		else{
			alert("Please, test your subtitle buy clicking on 'Show'");
		}
	});
	

}

function submit_generate(){
	var start = document.getElementById('start_slider').getBoundingClientRect();
	var end = document.getElementById('end_slider').getBoundingClientRect();
	var vid = document.getElementById('video_player').getBoundingClientRect();


	var vlen = vid.right - vid.left;
	var slen = start.right - start.left;
	var elen = end.right - end.left;

	sx_rel_vid = (start.left - vid.left) + slen/2;
	ex_rel_vid = (end.left - vid.left) + elen/2;

	if (loaded) {
		var v_dur = document.getElementById('video_player').duration
		var s_time = v_dur*sx_rel_vid/vlen;
		var e_time = v_dur*ex_rel_vid/vlen;
		if (s_time > e_time) {
			alert("Starting time should be before ending time.");
		}
		else{
			gs_time = s_time;
			ge_time = e_time;
			document.getElementById("sub_text_generate").innerHTML = document.getElementById("sub_text_input_generate").value;
		}
	}
	else{
		alert("Wait for video to be loaded...");
	}


	console.log(start.x, start.y);
	console.log(end.x, end.y);
	console.log(vid.x, vid.y, vid.top, vid.bottom, vid.right, vid.left);
}


function random_sub(){

	var start = document.getElementById('start_slider').getBoundingClientRect();
	var end = document.getElementById('end_slider').getBoundingClientRect();
	var vid = document.getElementById('video_player').getBoundingClientRect();


	var vlen = vid.right - vid.left;
	var slen = start.right - start.left;
	var elen = end.right - end.left;

	var dbRef = firebase.database().ref().child('subtitles').child('id').child("gen_times");
	dbRef.once('value', function(snapshot){
		var num_child = snapshot.numChildren();
		ran_int = Math.floor(Math.random() * num_child) + 1;

		sub = dbRef.child(String(ran_int));
		sub.once('value', function(snapshot){
			text = snapshot.child("text").val();
			s_time = snapshot.child("s_time").val();
			e_time = snapshot.child("e_time").val();


			document.getElementById("sub_text_generate").innerHTML = text;
			document.getElementById("sub_text_input_generate").value = text;
			//document.getElementById("start_slider").element.left = s_time + vid.left - slen/2;
			//document.getElementById("start_slider").setBoundingClientRect()
			//alert(document.getElementById("start_slider").getBoundingClientRect().left);

			//document.getElementById("end_slider").style.left = e_time + vid.left - elen/2;
		})
	});
}