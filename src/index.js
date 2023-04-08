import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css'


const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleInputForm, DEBOUNCE_DELAY));

function handleInputForm(e) {
    const inputCountry = e.target.value.trim();

   if (inputCountry === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
}  

fetchCountries(inputCountry)
.then(countriesObj => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    let backup ='';
    let card = '';
    if (countriesObj.length > 10){
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    
    } else if (countriesObj.length >= 2 && countriesObj.length <= 10){
        
        countriesObj.forEach(countryItem => {
            backup += `<li><img class ="img__Flag" src="${countryItem.flags.svg}" alt="${countryItem.name.common}"/><p>"${countryItem.name.official}"</p></li>`; 
        });
        countryList.insertAdjacentHTML("beforeend",backup);
    }else {
             countriesObj.map(country => {
              
            card += `<ul class = "inform">
            <li ><h1><img class ="img__Flag" src="${country.flags.svg}" alt="${country.name.common}" /><p>"${country.name.official}"</h1></li>
            <li><p>Capital:${country.capital}</p></li>
            <li><p>Population:${country.population}</p></li>
            <li><p>Languages:${Object.values(country.languages).join(', ')}</p></li>
            </ul>`;
        });
        countryInfo.insertAdjacentHTML("beforeend",card);
    }
   })
   .catch(() => {
    Notiflix.Notify.failure("Oops, there is no country with that name");
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
   })
}
    