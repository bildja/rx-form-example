import Rx from 'rx'
import './index.styl'
import {
  map,
  pipe,
  every,
  first,
  last,
  not,
  identity
} from './helpers'

const formElement = document.querySelector('form');
const rootElement = document.querySelector('.app');
const submitButtonElement = formElement.querySelector('[type="submit"]');
const requiredElements = formElement.querySelectorAll('input[required]');

const formSubmit = Rx.Observable.fromEvent(formElement, 'submit');

const inputFromEvent = el => Rx.Observable.fromEvent(el, 'input')
  .map(({
    target
  }) => target.value)
  .startWith('');

const inputStreams = map(inputFromEvent)(requiredElements);
const inputStream = Rx.Observable.combineLatest(...inputStreams);

const formValidityStream = inputStream.map(every(Boolean));
const inputValidStream = formValidityStream.filter(identity);
const inputInvalidStream = formValidityStream.filter(not);
const formSubmitValidity = formSubmit.withLatestFrom(formValidityStream);
const formSubmitSuccess = formSubmitValidity
  .filter(last)
  .map(first);

const formSubmitInvalid = formSubmitValidity
  .filter(pipe(last, not))
  .map(first);

Rx.Observable.merge(
    formSubmitSuccess.map(() => false),
    inputInvalidStream.map(() => false),
    inputValidStream.map(() => true)
  )
  .debounce(6000)
  .filter(identity)
  .subscribe(() => {
    submitButtonElement.classList.add('marked');
  });


formSubmit.subscribe(event => {
  event.preventDefault();
});

formSubmitSuccess.subscribe(() => {
  rootElement.classList.toggle('next');
});

formSubmitInvalid.subscribe(() => {
  alert('Invalid form');
});

Rx.Observable.merge(formSubmitSuccess, inputInvalidStream).subscribe(() => {
  submitButtonElement.classList.remove('marked');
});
