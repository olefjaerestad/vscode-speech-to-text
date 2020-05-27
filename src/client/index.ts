import { PHRASE_MAPPINGS } from './constant/phrase-mappings.js';

// @ts-ignore
var SpeechRecognition = (SpeechRecognition || webkitSpeechRecognition); // must use 'var'
const socket = new WebSocket('ws://localhost:9001');
const recognition = new SpeechRecognition();
const outputEl = document.getElementById('output');

recognition.continuous = true; // Keep recording results.
recognition.interimResults = false; // Return non-final results. Fast, but inaccurate.
recognition.lang = 'en-US'; // 'nb-NO' for norwegian.
recognition.maxAlternatives = 1;

recognition.addEventListener('result', (e: any) => {
	const result = e.results[e.resultIndex][0].transcript.trim();
	addPhrase(result);
});
recognition.addEventListener('end', (e: any) => {
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
// ['audioend', 'audiostart', 'end', 'error', 'nomatch', 'result', 'soundend', 'soundstart', 'speechend', 'speechstart', 'start']
// .forEach(name => recognition.addEventListener(name, (e: any) => console.log(e)));

socket.addEventListener('open', (e: any) => {
	// Todo: comment in when done testing
	recognition.start();

	// todo: remove this when done testing:
	(document.getElementById('phraseForm') as HTMLFormElement).addEventListener('submit', e => {
		e.preventDefault();
		// @ts-ignore
		addPhrase(document.getElementById('phrase').value);
		// @ts-ignore
		document.getElementById('phrase').value = '';
	});
	// document.getElementById('phraseForm').remove();
});

const addPhrase = (phrase: string) => {
	for (const phraseMapping of PHRASE_MAPPINGS.entries()) {
		if (phraseMapping[0].includes(phrase)) {
			phrase = phraseMapping[1];
			break;
		}
	}

	socket.send(phrase);
	(outputEl as HTMLUListElement).innerHTML += `<li>${phrase}</li>`;
};