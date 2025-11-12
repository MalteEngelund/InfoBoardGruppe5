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

  // CHANGED: antal timer, lægges til hver StartDate fra API
  const HOURS_OFFSET = 1; // CHANGED

  // Clear previous schedule display
  const container = document.getElementById('schedule');
  if (container) container.innerHTML = '';

  // Step 1: gather today's events grouped by team
  const eventsPerTeam = {};

  selectedEducation.forEach(education => {
    scheduleData
      .filter(({ Education: ed, StartDate }) => {
        if (!StartDate) return false; // CHANGED: guard
        // CHANGED: lav Date fra API og læg en time til
        const eventStart = new Date(StartDate); // CHANGED
        eventStart.setHours(eventStart.getHours() + HOURS_OFFSET); // CHANGED
        const eventDate = `${eventStart.getFullYear()}-${(eventStart.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${eventStart.getDate().toString().padStart(2, "0")}`; // CHANGED
        return ed === education && eventDate === todayDate; // CHANGED
      })
      .forEach(event => {
        // CHANGED: gem den justerede starttid i objektet så resten af koden bruger den
        const eventStart = new Date(event.StartDate);
        eventStart.setHours(eventStart.getHours() + HOURS_OFFSET);
        const ev = { ...event, AdjustedStartDate: eventStart.toISOString() }; // CHANGED

        const { Team } = ev;
        if (!eventsPerTeam[Team]) eventsPerTeam[Team] = [];
        eventsPerTeam[Team].push(ev);
      });
  });

  // Step 2: sort each team's events and find current event (within 60 min window)
  Object.keys(eventsPerTeam).forEach(team => {
    eventsPerTeam[team].sort(
      (a, b) => new Date(a.AdjustedStartDate) - new Date(b.AdjustedStartDate) // CHANGED
    );
    
    // Find event that started within last 60 minutes (brug AdjustedStartDate) - CHANGED
    const currentEvent = eventsPerTeam[team].find(event => {
      if (!event.AdjustedStartDate) return false; // CHANGED
      const eventStart = new Date(event.AdjustedStartDate); // CHANGED
      const timeDiff = (now - eventStart) / 1000 / 60; // minutes ago
      return timeDiff >= 0 && timeDiff < 60; // started 0-60 min ago
    });

    if (currentEvent) {
      const { Team, AdjustedStartDate, Subject, Education, Room } = currentEvent; // CHANGED
      // send justerede tidspunkt videre (AdjustedStartDate) så visningen matcher
      renderSchedule({ Team, StartDate: AdjustedStartDate, Subject, Education, Room }); // CHANGED
    }
  });
}

export const startScheduleUpdates = (intervalMs = 30000) => {
  showSchedule();
  return setInterval(showSchedule, intervalMs);
}