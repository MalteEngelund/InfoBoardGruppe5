
export const renderSchedule = ({ Team, StartDate, Subject, Education, Room, color }) => {
  const container = document.getElementById('activitiesByMalte') || document.body;
  const skema = document.createElement('div');
  skema.className = 'schedule-item';
  if (color) skema.style.backgroundColor = color;

  const startTime = StartDate
    ? new Date(StartDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    : '';

  skema.innerHTML = `
    <h3 style="background-color: ${color || 'transparent'};">${Room || ''}</h3>
    <p>${Team || ''}</p>
    <p>${Subject || ''}</p>
    <p>${Education || ''}</p>
    <p>${startTime}</p>
  `;

  // If colour guide exists, insert the new item before it so the guide remains at the bottom.
  const existingGuide = container.querySelector('.education-circles');
  if (existingGuide) {
    container.insertBefore(skema, existingGuide);
    return;
  }

  // Otherwise append the item and then create & append the colour guide (so it ends up at the bottom).
  container.append(skema);

  const colourGuide = document.createElement('div');
  colourGuide.className = 'education-circles';
  colourGuide.innerHTML = `
    <span>WU</span>
    <span>MG</span>
    <span>GT</span>
  `;
  container.append(colourGuide);
};
