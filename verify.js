var ver_ran_sub;
function load_sub_verify(){
	subsDB = firebase.database().ref().child("subtitles").child(vid_id).child("sub_times");
	subsDB.once("value").then(function(snapshot){
		snapshot.forEach(function(child){
			if (child.key !== "0") {
				sub_times.push([child.val().s_time, child.val().e_time, child.child("generated").val()]);
			}
			
		});
		console.log(sub_times);

		progress_so_far_verify();
		random_sub_verify();

	});
}
function progress_so_far_verify(){
	var vid = document.getElementById('video_player').getBoundingClientRect();
	var vlen = vid.right - vid.left;
	var v_dur = document.getElementById('video_player').duration;

	var can = document.getElementById("progressed_bar");
	var ctx = can.getContext("2d");
	ctx.canvas.width = vlen;
	for (var i = sub_times.length - 1; i >= 0; i--) {
		t_s = sub_times[i][0];
		t_e = sub_times[i][1];
		console.log(sub_times[i][2], t_s, t_e);

		ctx.fillStyle = "#990000";
		console.log("rect", t_s *(vlen/v_dur), 0, (t_e - t_s)*(vlen/v_dur), 160);
		ctx.fillRect(t_s *(vlen/v_dur), 0, (t_e - t_s)*(vlen/v_dur), 160);
	}
}

function random_sub_verify(){

	var start = document.getElementById('start_slider').getBoundingClientRect();
	var end = document.getElementById('end_slider').getBoundingClientRect();
	var vid = document.getElementById('video_player').getBoundingClientRect();


	var vlen = vid.right - vid.left;
	var slen = start.right - start.left;
	var elen = end.right - end.left;

	var dbRef = firebase.database().ref().child('subtitles').child(vid_id).child("sub_times");
	dbRef.orderByChild("verified").once('value', function(snapshot){
		var flag = true;
		snapshot.forEach(function(child){

			ver_ran_sub = child.key;

			text_generated = child.child("generated").val();
			text_fixed_1 = child.child("fix_1").val();
			text_fixed_2 = child.child("fix_2").val();


			var choice1 = document.getElementById('sub_text_input_generate_1');
			var choice2 = document.getElementById('sub_text_input_generate_2');
			var choice3 = document.getElementById('sub_text_input_generate_3');
			choice1.value = text_generated;
			choice2.value = text_fixed_1;
			choice3.value = text_fixed_2;


			s_time = child.child("s_time").val();
			e_time = child.child("e_time").val();

			gs_time = s_time;
			ge_time = e_time;

			//document.getElementById("sub_text_input_generate").value = text_generated;

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

			console.log(text_generated, s_time, e_time);
			return true;
		});

	});
}

