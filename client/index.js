/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
 */

const socket = new WebSocket('ws://localhost:9000');
var SpeechRecognition = (SpeechRecognition || webkitSpeechRecognition);
var SpeechGrammarList = (SpeechGrammarList || webkitSpeechGrammarList);
var SpeechRecognitionEvent = (SpeechRecognitionEvent || webkitSpeechRecognitionEvent);
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
const colors = ['aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral'];
const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.start();

recognition.addEventListener('result', e => {
	console.log(e);
	// TODO:
	// socket.send(e.results[0][0]);
});

socket.addEventListener('open', e => {
	console.log(e);
	// TODO: remove this when done testing.
	socket.send('for');
});

// setTimeout(() => {
// 	location.reload();
// }, 2000);