/* export const renderSchedule = ({ Team, StartDate, Subject, Education, Room }) => {
  const container = document.getElementById('schedule') || document.body
  const div = document.createElement('div')
  div.className = 'schedule-item'
  div.innerHTML = `
    <h3>${Room}</h3>
    <p>${Team}</p>
    <p>${Subject}</p>
    <p>${new Date(StartDate).toLocaleTimeString('en-GB', { hour12: false })}</p>
    `
  container.appendChild(div)
} */


export const renderSchedule = ({ Team, StartDate, Subject, Education, Room }) => {
  const container = document.getElementById('schedule') || document.body
  const div = document.createElement('div')
  div.className = 'schedule-item'
  
  const startTime = new Date(StartDate).toLocaleTimeString('en-GB', { hour12: false });
  const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
  
  div.innerHTML = `
    <h3>${Room}</h3>
    <p>${Team}</p>
    <p>${Subject}</p>
    <p>Start: ${startTime} </p>
    `
  container.appendChild(div)
}
// | Now: ${currentTime}