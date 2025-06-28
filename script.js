const DateTime = luxon.DateTime;

const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');
const calculateBtn = document.getElementById('calculateBtn');
const cityListDiv = document.getElementById('cityList');
const resultDiv = document.getElementById('result');

let cities = [];

addCityBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    cities.push(city);
    updateCityList();
    cityInput.value = '';
  }
});

function updateCityList() {
  cityListDiv.innerHTML = '<strong>Selected Cities:</strong> ' + cities.join(', ');
}

calculateBtn.addEventListener('click', () => {
  if (cities.length < 2) {
    alert('Please add at least two cities/timezones.');
    return;
  }

  const slots = getOverlappingSlots(cities);
  displayResults(slots);
});

function getOverlappingSlots(cities) {
  const slots = [];

  // Check each hour of UTC day to see if it fits all participants' 9 AM – 8 PM
  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const utcTime = DateTime.utc().set({ hour: utcHour, minute: 0, second: 0, millisecond: 0 });

    let valid = true;
    const localTimes = [];

    for (const city of cities) {
      try {
        const localTime = utcTime.setZone(city);
        const hour = localTime.hour;

        // Check if within 9 AM – 8 PM
        if (hour < 9 || hour >= 20) {
          valid = false;
          break;
        }
        localTimes.push({ city, time: localTime.toFormat('hh:mm a') });
      } catch (err) {
        valid = false;
        break;
      }
    }

    if (valid) {
      slots.push(localTimes);
    }
  }

  return slots;
}

function displayResults(slots) {
  resultDiv.innerHTML = '';

  if (slots.length === 0) {
    resultDiv.innerHTML = '<p>No overlapping time slots found.</p>';
    return;
  }

  resultDiv.innerHTML = '<h3>Overlapping Time Slots:</h3>';

  slots.forEach((slot, index) => {
    const slotDiv = document.createElement('div');
    slotDiv.innerHTML = `<strong>Option ${index + 1}:</strong><br>` + slot.map(s => `${s.city}: ${s.time}`).join('<br>');
    slotDiv.style.marginBottom = '10px';
    resultDiv.appendChild(slotDiv);
  });
}
