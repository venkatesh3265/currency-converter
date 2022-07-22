const fromSelect = document.querySelector('[name="from_currency"]');
const toSelect = document.querySelector('[name="to_currency"]');
const fromInput = document.querySelector("#amount");
const exchangediv = document.querySelector(".exchange_amount");
let ratesbybase = {};
let currency = {
  USD: "United States Dollar",
  INR: " Indian Rupee",
  HRK: "Hong Kong Dollar",
  JPY: "Japanese Yen",
  BGN: "Bulgarian lev",
};

function generateOptions(options) {
  return Object.entries(options)
    .map(([currencycode, currencyName]) => {
      return `<option value="${currencycode}">${currencycode}-${currencyName} </option> `;
    })
    .join("");
}

const optionsHtml = generateOptions(currency);
console.log(optionsHtml);
fromSelect.innerHTML = optionsHtml;
toSelect.innerHTML = optionsHtml;
const apikey = "mF6X6M6xcN3UwbyvD6Tq9ZJmyHUQPJou";

const endpoint = "https://api.apilayer.com/exchangerates_data/latest";

const fetchRates = async (base = "INR") => {
  const res = await fetch(
    `${endpoint}?apikey=mF6X6M6xcN3UwbyvD6Tq9ZJmyHUQPJou&base=${base}`
  );
  const rates = await res.json();

  return rates;
};

async function convert(amount, from, to) {
  if (!ratesbybase[from]) {
    console.log(
      `Oh no! we don't have ${from} to convert it ${to}, so let's go get it!`
    );
    const rates = await fetchRates(from);
    console.log(rates);
    // store them for next time
    ratesbybase[from] = rates;
  }

  const rate = ratesbybase[from].rates[to];
  const covertedAmount = rate * amount;
  console.log(`${amount} ${from} is ${covertedAmount} in ${to}`);
  return covertedAmount;
}
function formatCurrency(amount, currency) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

const form = document.forms.currency;

form.addEventListener("input", handleInput);

async function handleInput(e) {
  const rawAmount = await convert(
    fromInput.value,
    fromSelect.value,
    toSelect.value
  );
  exchangediv.innerHTML = formatCurrency(rawAmount, toSelect.value);
}
