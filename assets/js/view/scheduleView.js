
export const renderSchedule = ({ Team, StartDate, Subject, Education, Room, color }) => {
  const container = document.getElementById('activitiesByMalte') || document.body;
  const div = document.createElement('div');
  div.className = 'schedule-item';
  div.style.backgroundColor = `${color}`

  // const startTime = new Date(StartDate).toLocaleTimeString('en-GB', { hour12: false });
  const startTime = new Date(StartDate).toLocaleTimeString('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

  div.innerHTML = `
    <h3 style="backgroundcolor: ${color};">${Room}</h3>
    <p>${Team}</p>
    <p>${Subject}</p>
    <p>${Education}</p>
    <p>${startTime}</p>
  `;

  container.appendChild(div);
};

