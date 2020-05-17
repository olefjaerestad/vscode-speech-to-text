const socket = new WebSocket('ws://localhost:9001');
var SpeechRecognition = (SpeechRecognition || webkitSpeechRecognition);
var SpeechGrammarList = (SpeechGrammarList || webkitSpeechGrammarList);
var SpeechRecognitionEvent = (SpeechRecognitionEvent || webkitSpeechRecognitionEvent);
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
const css = [
	'background-color',
	'color',
	'display',
	'font-family',
	'font-size',
	'indent',
	'list-style',
	'opacity', 
	'resize'
];
const grammar = '#JSGF V1.0; grammar colors; public <css> = ' + css.join(' | ') + ' ;';

speechRecognitionList.addFromString(grammar, 1);
recognition.continuous = true; // Keep recording results.
recognition.grammars = speechRecognitionList; // TODO: This doesn't seem to do anything?
recognition.interimResults = false; // Return non-final results. Fast, but inaccurate.
recognition.lang = 'en-US'; // 'nb-NO' for norwegian.
recognition.maxAlternatives = 1;

recognition.addEventListener('result', e => {
	console.log(e.results[e.resultIndex][0].transcript.trim());
	// TODO:
	socket.send(e.results[e.resultIndex][0].transcript.trim());
});
recognition.addEventListener('end', e => {
	/**
	 * Restart speech recognition when it stops, 
	 * as it seems to stop after X time of no speech.
	 * https://stackoverflow.com/questions/42895760/how-to-stop-and-restart-web-speech-api-correctly
	 * https://stackoverflow.com/questions/34818154/webkitspeechrecognition-stops-recording-randomly
	 * https://stackoverflow.com/questions/38702797/webkitspeechrecognition-stops-doesnt-fire-onend-at-random
	 */
	recognition.start();
});

socket.addEventListener('open', e => {
	recognition.start();
	// TODO: remove this when done testing.
	// socket.send('for');
});

// setTimeout(() => {
// 	location.reload();
// }, 2000);