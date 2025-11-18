(function () {
  const WEATHER_URL =
    'https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric';

  const container = document.createElement('div');
  container.className = 'infoboard';

  const clockEl = document.createElement('div');
  clockEl.id = 'clock';
  clockEl.textContent = '--:--';

  const hr = document.createElement('hr');

  const metaRow = document.createElement('div');
  metaRow.className = 'meta-row';

  const dateEl = document.createElement('div');
  dateEl.id = 'date';
  const dateText = document.createElement('span');
  dateText.className = 'date-text';
  dateText.textContent = '...';

  const tempEl = document.createElement('span');
  tempEl.className = 'temp';
  tempEl.textContent = '--°C';

  const iconEl = document.createElement('img');
  iconEl.id = 'weather-icon';
  iconEl.alt = 'vejr';
  iconEl.style.display = 'none';

  dateEl.appendChild(dateText);
  dateEl.appendChild(tempEl);
  dateEl.appendChild(iconEl);

  metaRow.appendChild(dateEl);
  
  container.appendChild(clockEl);
  container.appendChild(hr);
  container.appendChild(metaRow);

  // Prøv at indsætte i div#clockByFillip i stedet for direkte i body,
  // så JS "snakker" med din HTML og viser indholdet dér.
  const hostClock = document.getElementById('clockByFillip');
  if (hostClock) {
    hostClock.innerHTML = ''; // ryd evt. placeholder indhold
    hostClock.appendChild(container);
  } else {
    // fallback hvis elementet ikke findes
    document.body.appendChild(container);
  }

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  function capitalizeFirst(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function updateClock() {
    const now = new Date();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    clockEl.textContent = `${hours}:${minutes}`;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = now.toLocaleDateString('da-DK', options);
    dateText.textContent = capitalizeFirst(dateStr);
  }

  async function fetchWeather() {
    try {
      const res = await fetch(WEATHER_URL);
      if (!res.ok) throw new Error('Netværksfejl');
      const data = await res.json();

      const temp = Math.round(data.main.temp);
      const icon = data.weather && data.weather[0] && data.weather[0].icon;
      const desc = data.weather && data.weather[0] && data.weather[0].description;

      tempEl.textContent = `${temp}°C`;

      if (icon) {
        iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        iconEl.alt = desc || 'vejr';
        iconEl.style.display = 'inline-block';
      } else {
        iconEl.style.display = 'none';
      }
    } catch (err) {
      console.error('Hent vejret fejlede', err);
      tempEl.textContent = '--';
      iconEl.style.display = 'none';
    }
  }

  updateClock();
  fetchWeather();
  setInterval(updateClock, 1000); // opdater tid hvert sekund
  setInterval(fetchWeather, 10 * 60 * 1000); // opdater vejret hvert 10. minut
})();