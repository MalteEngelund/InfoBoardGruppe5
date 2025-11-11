/* "value": [
    {

      "Team": "ggr080125",
      "StartDate": "2025-11-11T07:15:00+01:00",
      "Subject": "Grafisk teknik.",
      "Education": "Grafisk teknik.",
      "Room": "N112b"
    } */



export const fetchSchedule = async () => {
  const url = 'https://iws.itcn.dk/techcollege/schedules?departmentcode=smed';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched schedule data:', data);

  } catch (error) {
    console.error('Error fetching schedule:', error)
  }
}

fetchSchedule()
console.error(fetchSchedule());
