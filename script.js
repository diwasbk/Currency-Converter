// This object maps currency codes to country codes for flag images
// Format: "CURRENCY_CODE": "COUNTRY_CODE"
// Example: USD (US Dollar) = US (United States flag)
const currencyToCountry = {
  AED: "AE", AFN: "AF", ALL: "AL", AMD: "AM", ANG: "NL", AOA: "AO", ARS: "AR",
  AUD: "AU", AZN: "AZ", BDT: "BD", BGN: "BG", BHD: "BH", BIF: "BI", BMD: "BM",
  BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS", BTN: "BT", BWP: "BW", BYN: "BY",
  CAD: "CA", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU",
  CZK: "CZ", DKK: "DK", DOP: "DO", DZD: "DZ", EGP: "EG", EUR: "FR", FJD: "FJ",
  GBP: "GB", GEL: "GE", GHS: "GH", GMD: "GM", GNF: "GN", GTQ: "GT", HKD: "HK",
  HNL: "HN", HRK: "HR", HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ",
  IRR: "IR", ISK: "IS", JMD: "JM", JOD: "JO", JPY: "JP", KES: "KE", KHR: "KH",
  KRW: "KR", KWD: "KW", KZT: "KZ", LAK: "LA", LKR: "LK", MAD: "MA", MDL: "MD",
  MGA: "MG", MMK: "MM", MNT: "MN", MOP: "MO", MUR: "MU", MVR: "MV", MXN: "MX",
  MYR: "MY", NAD: "NA", NGN: "NG", NOK: "NO", NPR: "NP", NZD: "NZ", OMR: "OM",
  PAB: "PA", PEN: "PE", PHP: "PH", PKR: "PK", PLN: "PL", QAR: "QA", RON: "RO",
  RUB: "RU", SAR: "SA", SEK: "SE", SGD: "SG", THB: "TH", TRY: "TR", TWD: "TW",
  TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US", UYU: "UY", UZS: "UZ", VND: "VN",
  ZAR: "ZA"
};


// ========================================
// STEP 1: Wait for the page to fully load
// ========================================
// This runs only AFTER all HTML elements are loaded
document.addEventListener("DOMContentLoaded", function () {
  
  // ========================================
  // STEP 2: Get all the HTML elements we need
  // ========================================
  // These are like "pointers" to our HTML elements
  const fromSelect = document.querySelector("#from");        // "From" currency dropdown
  const toSelect = document.querySelector("#to");            // "To" currency dropdown
  const fromFlag = document.querySelector("#fromFlag");      // "From" country flag image
  const toFlag = document.querySelector("#toFlag");          // "To" country flag image
  const amountInput = document.querySelector("#amount");     // Amount input field
  const result = document.querySelector("#result");          // Result message display
  const button = document.querySelector("#convert");         // Convert button

  // ========================================
  // STEP 3: Fill the dropdowns with currencies
  // ========================================
  // Loop through each currency in our currencyToCountry object
  for (let currency in currencyToCountry) {
    // Add currency to "From" dropdown
    fromSelect.add(new Option(currency, currency));
    
    // Add currency to "To" dropdown
    toSelect.add(new Option(currency, currency));
  }

  // ========================================
  // STEP 4: Set default currencies
  // ========================================
  // When page loads, show USD to NPR conversion
  fromSelect.value = "USD";
  toSelect.value = "NPR";
  
  // Update flags to show US and Nepal flags
  updateFlags();

  // ========================================
  // STEP 5: Add click listeners (respond to user actions)
  // ========================================
  // When user changes the "From" currency, update its flag
  fromSelect.addEventListener("change", updateFlags);
  
  // When user changes the "To" currency, update its flag
  toSelect.addEventListener("change", updateFlags);
  
  // When user clicks the Convert button, start conversion
  button.addEventListener("click", convertCurrency);

  // ========================================
  // FUNCTION 1: Convert Currency
  // ========================================
  // This function runs when the user clicks the Convert button
  async function convertCurrency() {
    // Get the amount the user entered
    const amount = amountInput.value;

    // Check if the amount is valid (must be greater than 0)
    if (amount <= 0) {
      result.textContent = "Enter a valid amount";
      return; // Stop here if invalid
    }

    // Show loading message while fetching data
    result.textContent = "Converting...";

    try {
      // Fetch exchange rates from the API
      // The API gives us the exchange rate FROM the selected "from" currency
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromSelect.value}`
      );
      
      // Convert the response to JSON format (JavaScript object)
      const data = await response.json();

      // Get the exchange rate for the "to" currency
      const rate = data.rates[toSelect.value];
      
      // Calculate the converted amount
      // Example: 100 USD * 136 = 13,600 NPR
      const converted = (amount * rate).toFixed(2);

      // Display the result in a nice format
      result.textContent =
        `${amount} ${fromSelect.value} = ${converted} ${toSelect.value}`;
    } catch {
      // If something goes wrong (no internet, API error), show error message
      result.textContent = "Something went wrong 😢";
    }
  }

  // ========================================
  // FUNCTION 2: Update Flags
  // ========================================
  // This function updates the flag images when currency changes
  function updateFlags() {
    // Get the country code for the "from" currency and update its flag
    fromFlag.src = `https://flagsapi.com/${currencyToCountry[fromSelect.value]}/flat/64.png`;
    
    // Get the country code for the "to" currency and update its flag
    toFlag.src = `https://flagsapi.com/${currencyToCountry[toSelect.value]}/flat/64.png`;
  }
});
