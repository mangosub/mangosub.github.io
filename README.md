# mangosub
is a crowdsourcing platform in which users can request videos to be subtitled. At the same same time they can work on others' requested videos and make subtitles. 
To generate subtitles we do devided work into three sections: Generate, Fix and Verify. When user upload video, it will be saved in Firebase Storage and video will be available for getting subtitled.
### Generate
In Generation part (generate.html) users see a video player, progress bar of video, progress bar of already generated subtitles, sliders to select portion of video to make subtitle, input text for entering text for subtitles, show button for checking how subtitles look during playback, submit button for submitting work done and home button for going to homescreen. 
* We developed cutom video player in order to make it same video player for different browsers and fit out generate workflow. 
* For progress bar of already generated subtitles, we load subtitles for current playing video from Firebase Database where all of user data, video subtitles data are stored. Subtitles timestamp are stored as seconds in the Firebase and when we retreave subtitle timestamps from firebase we convert seconds to pixel representation according to dimentions of the video. 
```solidity
start_time_in_sec = (start_slider.x - video_player.x) * video_player.width / video.duration
end_time_in_sec = (end.x + end.width - video_player.x) * video_player.width / video.duration
```
* With the same analogy we move slider pixels also will be converted to time and saven in Firebase later when user submits.
* We have custom text on top of the video canvas which we show current text of subtitle. Whenever currentTime of the video changes, we check the timestampt and show subtitles accordingly.
* User can click on Show button to see how setted subtitle looks like. User can edit both text and slider timing until he submits it.
* Submit button runs some functions before redirecting user to do more work. One of them is to check if Generation is done or not. If each of the unsubtitled portions of the video is less than 2 seconds, video will be considered as finished generation and it will be available for workers who fix already generated subtitles. User generated text will be stored at "generated" child of the video in the Firebase.
### Fix
In the fixing part (fix.html) users will be given the portion of the subtitle and their are asked to fix the text of that portion if they think that there is some error. All of the HTML elements of fix.html are almost same as generate.html which we discussed earlier. The only difference is, here portion is given for the user and sliders are fixed according to the given portion. For user what requires is just to fix the text of the already generated portion. We write fixed text separately at "fix_1" and "fix_2" children of the video location of the Firebase. With the same analogy when user clicks Submit, it check if all of the subtitles are fixed twice. If so this video will be available fore Verification.
### Verify
Follow generation and fixing, verification also works with the same analogy. Instead of editable input text, now we have three fixed texts which are "generated", "fix_1", "fix_2" values which came from previous sections. In this part user just need to select the subtitle which he thinks is correct one. When user submits his work, we again check if all of the subtitles are verified. If so we set this video as fully subtitled and generate ".srt" file format according to timestampt and the final text from verify stage. Within our verify.html we convert timestamp (in seconds) and text stored in Firebase to ".srt" file format and save it to the Firebase Storage. 
User then can go to history part of his profile and download ".srt" formatted subtitle of his requested video.

