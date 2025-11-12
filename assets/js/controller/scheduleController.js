/*
  struktur
"value": [
    {
      "Team": "ggr080125",
      "StartDate": "2025-11-11T07:15:00+01:00",
      "Subject": "Grafisk teknik.",
      "Education": "Grafisk teknik.",
      "Room": "N112b"
} */

/* import { fetchSchedule } from '../model/scheduleModel.js'
import { renderSchedule } from '../view/scheduleView.js'


  export const showSchedule = async () => {
  const scheduleData = await fetchSchedule()

const today = new Date();
const todayDate = `${today.getFullYear()}-${(today.getMonth()+1)
  .toString()
  .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

const selectedEducation = ["Mediegrafiker", "Grafisk teknik.", "Webudvikler"];

// Step 1: gather today's events grouped by team
const eventsPerTeam = {};

// loop through each education
selectedEducation.forEach(education => {
  scheduleData
    .filter(({ Education: ed, StartDate }) => {
      const event = new Date(StartDate);
      const eventDate = `${event.getFullYear()}-${(event.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${event.getDate().toString().padStart(2, "0")}`;
      return ed === education && eventDate === todayDate;
    })
    .forEach(event => {
      const { Team } = event;
      if (!eventsPerTeam[Team]) eventsPerTeam[Team] = [];
      eventsPerTeam[Team].push(event);
    });
});

// Step 2: sort each team’s events by time and take the first one (next upcoming)
Object.keys(eventsPerTeam).forEach(team => {
  eventsPerTeam[team].sort(
    (a, b) => new Date(a.StartDate) - new Date(b.StartDate)
  );
  const nextEvent = eventsPerTeam[team][0]; // only the next upcoming event
  if (nextEvent) {
    const { Team, StartDate, Subject, Education, Room } = nextEvent;
    renderSchedule({ Team, StartDate, Subject, Education, Room });
  }
});
} */

import { fetchSchedule } from '../model/scheduleModel.js'
import { renderSchedule } from '../view/scheduleView.js'

export const showSchedule = async () => {
  const scheduleData = await fetchSchedule()

  const now = new Date();
  const todayDate = `${now.getFullYear()}-${(now.getMonth()+1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  const selectedEducation = ["Mediegrafiker", "Grafisk teknik.", "Webudvikler"];

  // Clear previous schedule display
  const container = document.getElementById('schedule');
  if (container) container.innerHTML = '';

  // Step 1: gather today's events grouped by team
  const eventsPerTeam = {};

  selectedEducation.forEach(education => {
    scheduleData
      .filter(({ Education: ed, StartDate }) => {
        const event = new Date(StartDate);
        const eventDate = `${event.getFullYear()}-${(event.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${event.getDate().toString().padStart(2, "0")}`;
        return ed === education && eventDate === todayDate;
      })
      .forEach(event => {
        const { Team } = event;
        if (!eventsPerTeam[Team]) eventsPerTeam[Team] = [];
        eventsPerTeam[Team].push(event);
      });
  });

  // Step 2: sort each team's events and find current event (within 60 min window)
  Object.keys(eventsPerTeam).forEach(team => {
    eventsPerTeam[team].sort(
      (a, b) => new Date(a.StartDate) - new Date(b.StartDate)
    );
    
    // Find event that started within last 60 minutes
    const currentEvent = eventsPerTeam[team].find(event => {
      const eventStart = new Date(event.StartDate);
      const timeDiff = (now - eventStart) / 1000 / 60; // minutes ago
      return timeDiff >= 0 && timeDiff < 60; // started 0-60 min ago
    });

    if (currentEvent) {
      const { Team, StartDate, Subject, Education, Room } = currentEvent;
      renderSchedule({ Team, StartDate, Subject, Education, Room });
    }
  });
}

export const startScheduleUpdates = (intervalMs = 30000) => {
  showSchedule();
  return setInterval(showSchedule, intervalMs);
}