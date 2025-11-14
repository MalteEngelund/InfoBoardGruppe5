
import { fetchSchedule } from '../model/scheduleModel.js';
import { renderSchedule } from '../view/scheduleView.js';

// Assign a color to each education type
const educationColors = {
  "Mediegrafiker": "#97BEAC99",      // green $color-mg-light-green
  "Grafisk teknik.": "#F5C96199",    // yellow $color-tg-light-yellow
  "Webudvikler": "#f4690c99"         // orange $color-wu-manhattan
};

export const showSchedule = async () => {
  const scheduleData = await fetchSchedule();

  const now = new Date();
  const todayDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  const selectedEducation = ["Mediegrafiker", "Grafisk teknik.", "Webudvikler"];
  const HOURS_OFFSET = 1; // adjust API times if needed

  //  Clear previous schedule so new data replaces it
  const container = document.getElementById('activitiesByMalte');
  if (container) container.innerHTML = '';

  //  Group today's events by team
  const eventsPerTeam = {};

  selectedEducation.forEach(education => {
    scheduleData
      .filter(({ Education: ed, StartDate }) => {
        if (!StartDate) return false;
        const eventStart = new Date(StartDate);
        eventStart.setHours(eventStart.getHours() + HOURS_OFFSET);
        const eventDate = `${eventStart.getFullYear()}-${(eventStart.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${eventStart.getDate().toString().padStart(2, "0")}`;
        return ed === education && eventDate === todayDate;
      })
      .forEach(event => {
        const eventStart = new Date(event.StartDate);
        eventStart.setHours(eventStart.getHours() + HOURS_OFFSET);
        const adjustedEvent = { ...event, AdjustedStartDate: eventStart.toISOString() };

        const { Team } = adjustedEvent;
        if (!eventsPerTeam[Team]) eventsPerTeam[Team] = [];
        eventsPerTeam[Team].push(adjustedEvent);
      });
  });

  //  Sort each team's events and pick current or next
  Object.keys(eventsPerTeam).forEach(team => {
    const events = eventsPerTeam[team].sort(
      (a, b) => new Date(a.AdjustedStartDate) - new Date(b.AdjustedStartDate)
    );

    // Try to find a current event (started within last 90 min)
    let eventToDisplay = events.find(ev => {
      const eventStart = new Date(ev.AdjustedStartDate);
      const timeDiff = (now - eventStart) / 1000 / 60; // minutes
      return timeDiff >= 0 && timeDiff < 90; // 0-90 min ago
    });

    // If no current event, pick the next upcoming
    if (!eventToDisplay) {
      eventToDisplay = events.find(ev => new Date(ev.AdjustedStartDate) > now);
    }

    //  Render event with color for its education
    if (eventToDisplay) {
      const { Team, AdjustedStartDate, Subject, Education } = eventToDisplay;
      const { Room } = eventToDisplay;
      const color = educationColors[Education] || "#000"; // default black
      renderSchedule({
        Team,
        StartDate: AdjustedStartDate,
        Subject,
        Education,
        Room,
        color
      });
    }
  });
};

// Auto-update schedule every intervalMs milliseconds
export const startScheduleUpdates = (intervalMs = 30000) => {
  showSchedule(); // initial load
  return setInterval(showSchedule, intervalMs); // repeat updates
};
