// import * as tf from '@tensorflow/tfjs';
// import * as tmImage from '@teachablemachine/image';


const URL = "https://teachablemachine.withgoogle.com/models/wYGvo9ymg/";

let imageLoaded = false;
let image = null;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		
		image = new Image();
		image.src = dataURL;
		console.log(image);
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
let modelLoaded = false;
$( document ).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').show();
    console.log( "Loading model..." );
	const modelURL = URL + "model.json";
	const metadataURL = URL + "metadata.json";
	model = await tmImage.load(modelURL, metadataURL);
    console.log( "Model loaded." );
	$('.progress-bar').hide();
	modelLoaded = true;
});

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
	
	// let image = $('#selected-image').get(0);
	
	// Pre-process the image
	console.log( "Loading image..." );
	
	let predictions = await model.predictTopK(image);
	console.log(predictions);
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 2);
		console.log( top5);
	$("#prediction-list").empty();
	predictions.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toString()}</li>`);
		});
});
