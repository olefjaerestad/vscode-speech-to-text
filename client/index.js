const socket = new WebSocket('ws://localhost:9001');
var SpeechRecognition = (SpeechRecognition || webkitSpeechRecognition);
var SpeechGrammarList = (SpeechGrammarList || webkitSpeechGrammarList);
var SpeechRecognitionEvent = (SpeechRecognitionEvent || webkitSpeechRecognitionEvent);
const recognition = new SpeechRecognition();
const speechGrammarList = new SpeechGrammarList();
const css = [ // Only required for words that aren't recognized by the default speech recognition service.
	// 'background-color',
	// 'color',
	// 'display',
	// 'font-family',
	// 'font-size',
	// 'indent',
	// 'list-style',
	// 'opacity', 
	// 'resize'
	'eenie meenie'
];
const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + css.join(' | ') + ' ;';
const outputEl = document.getElementById('output');

speechGrammarList.addFromString(grammar, 1);
recognition.continuous = true; // Keep recording results.
recognition.grammars = speechGrammarList;
recognition.interimResults = false; // Return non-final results. Fast, but inaccurate.
recognition.lang = 'en-US'; // 'nb-NO' for norwegian.
recognition.maxAlternatives = 1;

recognition.addEventListener('result', e => {
	const result = e.results[e.resultIndex][0].transcript.trim();
	socket.send(result);
	outputEl.innerHTML += `<li>${result}</li>`;
});
recognition.addEventListener('end', e => {
	/**
	 * Restart speech recognition when it stops, 
	 * as it seems to stop after X time without speech.
	 * https://stackoverflow.com/questions/42895760/how-to-stop-and-restart-web-speech-api-correctly
	 * https://stackoverflow.com/questions/34818154/webkitspeechrecognition-stops-recording-randomly
	 * https://stackoverflow.com/questions/38702797/webkitspeechrecognition-stops-doesnt-fire-onend-at-random
	 */
	recognition.start();
});

// todo: remove this when done testing:
['audioend', 'audiostart', 'end', 'error', 'nomatch', 'result', 'soundend', 'soundstart', 'speechend', 'speechstart', 'start']
.forEach(name => recognition.addEventListener(name, e => console.log(e)));

socket.addEventListener('open', e => {
	// Todo: comment in when done testing
	// recognition.start();
	
	// todo: remove this when done testing:
	// socket.send('for');
	// todo: remove this when done testing:
	document.getElementById('phraseForm').addEventListener('submit', e => {
		e.preventDefault();
		socket.send(document.getElementById('phrase').value);
		document.getElementById('phrase').value = '';
	});
});

// todo: remove this when done testing:
// setTimeout(() => {
// 	location.reload();
// }, 2000);