var loaded = false;
var gs_time;
var ge_time;
var ran_int;

var vid_id;
var gen_tex;
var genereted = false;

var sub_times = [];
var fixed_count;

var fix_tex;
var is_fixed;
var ticked = "-1";

var fb_gen_tex;
var fb_fix_1_tex;

function tick_click(){
    tick_show();
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
	ticked = id;
}
function getTicked(){ return ticked;}
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

function update_times(){
	var vid = document.getElementById("video_player");
	var curTime = vid.currentTime;
	if (sub_times.length === 0) {
		document.getElementById("sub_text_generate").innerHTML = "";
	}
	for (var i = sub_times.length - 1; i >= 0; i--) {
		t1 = sub_times[i][0];
		t2 = sub_times[i][1];
		console.log(curTime);
		if (curTime >= t1 && curTime <= t2) {
			document.getElementById("sub_text_generate").innerHTML = sub_times[i][2];
			break;
		}
		else{
			document.getElementById("sub_text_generate").innerHTML = "";
		}
	}
}
window.onload = function(){ 
    var main_video = document.getElementById("video_player");
	main_video.ontimeupdate = function() {
		var curTime = main_video.currentTime;

		update_times();

		if (gs_time !== undefined && curTime >= gs_time && curTime <= ge_time) {
			document.getElementById("sub_text_generate").innerHTML = gen_tex;
		}
	};

};

function submit_fix(){
	console.log(fixed_count, gs_time, ge_time, fb_gen_tex);
	var text = document.getElementById("sub_text_input_generate").value;
	var dbRef = firebase.database().ref().child('subtitles').child(vid_id).child("sub_times").child(ran_int);
	dbRef.once("value", function(snapshot){
		if (is_fixed) {
			fixed_count = fixed_count+1;
			if (fixed_count === 1) {
				dbRef.set({
					"fix_1": text,
					"fixed":fixed_count,
					"e_time":ge_time,
					"s_time":gs_time,
					"generated":fb_gen_tex,
					});
				document.getElementById('id01').style.display='block';
			}
			else{
				dbRef.set({
					"fix_2": text,
					"fixed":fixed_count,
					"fix_1": fb_fix_1_tex,
					"e_time":ge_time,
					"s_time":gs_time,
					"generated":fb_gen_tex,
					});
				document.getElementById('id01').style.display='block';

			}
		}
		else{
			alert("Please, test your subtitle buy clicking on 'Thick Button'");
		}
	});
	

}
function submit(){
	var text = document.getElementById("sub_text_input_generate").value;
	var dbRef = firebase.database().ref().child('subtitles').child(vid_id).child("sub_times");
	dbRef.once("value", function(snapshot){
		var new_child = dbRef.child(String(snapshot.numChildren()+1));
		if (gs_time !== undefined) {
			new_child.set({
				"generated": text,
				"s_time": gs_time,
				"e_time": ge_time,
				"fixed":0,
				});
			document.getElementById('id01').style.display='block';
		}
		else{
			alert("Please, test your subtitle buy clicking on 'Show'");
		}
	});
	

}

function tick_show(){

	fix_tex = document.getElementById("sub_text_input_generate").value;
	is_fixed = true;
}

function submit_generate(){
	var start = document.getElementById('start_slider').getBoundingClientRect();
	var end = document.getElementById('end_slider').getBoundingClientRect();
	var vid = document.getElementById('video_player').getBoundingClientRect();


	var vlen = vid.right - vid.left;
	var slen = start.right - start.left;
	var elen = end.right - end.left;

	sx_rel_vid = (start.left - vid.left);
	ex_rel_vid = (end.right - vid.left);

	console.log(sx_rel_vid);
	console.log(ex_rel_vid);


	if (loaded) {
		var v_dur = document.getElementById('video_player').duration
		var s_time = v_dur*sx_rel_vid/vlen;
		var e_time = v_dur*ex_rel_vid/vlen;
		if (s_time > e_time) {
			alert("Starting time should be before ending time.");
		}
		else if (!gen_in_empty(s_time, e_time)) {
			alert("Please, generate subtitle only for portions that don't have subtitle.")
		}
		else{
			gs_time = s_time;
			ge_time = e_time;
			gen_tex = document.getElementById("sub_text_input_generate").value;
			genereted = true;
			//update_times();
			//document.getElementById("sub_text_generate").innerHTML = document.getElementById("sub_text_input_generate").value;
			alert("Play the video at specified time to see how your subtitle looks like.")
		}
	}
	else{
		alert("Wait for video to be loaded...");
	}

}

function gen_in_empty(t1, t2){
	for (var j = t2 - 1; j >= t1; j--) {
		console.log(t1);
		console.log(t2);
		for (var i = sub_times.length - 1; i >= 0; i--) {
			t_s = sub_times[i][0];
			t_e = sub_times[i][1];
			console.log(j, t_s, t_e);

			if (j >= t_s && j <= t_e) {
				console.log("fuck it");
				return false;
			}
		}
	}
	return true;

}


function random_sub(){

	var start = document.getElementById('start_slider').getBoundingClientRect();
	var end = document.getElementById('end_slider').getBoundingClientRect();
	var vid = document.getElementById('video_player').getBoundingClientRect();


	var vlen = vid.right - vid.left;
	var slen = start.right - start.left;
	var elen = end.right - end.left;

	var dbRef = firebase.database().ref().child('subtitles').child(vid_id).child("sub_times");
	dbRef.orderByChild("fixed").once('value', function(snapshot){
		var flag = true;
		snapshot.forEach(function(child){
			if (child.key !== "0" && child.child("fixed").val() < 2) {
				ran_int = child.key;
				fixed_count = child.child("fixed").val();

				text = child.child("generated").val();

				fb_gen_tex = text;

				gs_time = child.child("s_time").val();
				ge_time = child.child("e_time").val();

				if (fixed_count == 1) {
					fb_fix_1_tex = child.child("fix_1").val();
				}

				s_time = child.child("s_time").val();
				e_time = child.child("e_time").val();

				document.getElementById("sub_text_input_generate").value = text;

				// Set sliders to sub place;
				var v_dur = document.getElementById('video_player').duration;

				console.log(v_dur, vlen, elen);
				//console.log(document.getElementById("end_slider").getBoundingClientRect().right);
				document.getElementById("start_slider").style.left = s_time*vlen/v_dur +"px";
				document.getElementById("end_slider").style.left = (e_time*vlen/v_dur - elen) + "px";

				document.getElementById("start_slider").style.visibility = "visible";
				document.getElementById("end_slider").style.visibility = "visible";

				//console.log(document.getElementById("end_slider").getBoundingClientRect().right);
				//document.getElementById("end_slider").style.left = e_time+"px";

				console.log(text, s_time, e_time);
				flag = false;
				return true;
			};
			
		});
		if (flag) {
			alert("All are fixed for this video. Please come back later or enjoy the video.")

		}

	});
}
function load_subtitles(){
	subsDB = firebase.database().ref().child("subtitles").child(vid_id).child("sub_times");
	subsDB.once("value").then(function(snapshot){
		snapshot.forEach(function(child){
			if (child.key !== "0") {
				sub_times.push([child.val().s_time, child.val().e_time, child.child("generated").val()]);
			}
			
		});
		console.log(sub_times);

	});
}
