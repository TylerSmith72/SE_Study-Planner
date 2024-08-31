import React, { useEffect, useState } from "react";
import { NavBar } from '.';
import styles from '../style';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import axios from 'axios';

const StudyCalendar = () => {
  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState([]);
  const colour = {
    Exam:"#6aa84f",
    Coursework:"#6aa84g",
    Programming:"#FE654F",
    Test:"#29335C",
    Studying:"#055864",
    Writing:"#A9DBB8",
    Reading:"#525174",
    Other: "#F3A712"
  }

  useEffect(() => {
    getSummativeInfo();
  }, []);


  const getSummativeInfo = async () => {
    let eventsToAdd = [];
    const url = 'http://localhost:4000/studycallender/getSummatives';
    const token = localStorage.getItem('token')
    const config = {
        headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${token}`
        },
    };

    await axios
    .get(url, config)
    .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          eventsToAdd.push({
            id: response.data[i].summative_id,
            text: response.data[i].summative_name,
            start: response.data[i].summative_due_date,
            end: response.data[i].summative_due_date,
            barColor: colour[response.data[i].summative_type],
          })
        }
    })
    .catch((error) => {
        console.log(error);
    });

    const url2 = 'http://localhost:4000/studycallender/getTasks';

    await axios
    .get(url2, config)
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        const type = response.data[i].task_type
        eventsToAdd.push({
          id: response.data[i].task_id,
          text: response.data[i].task_name,
          start: response.data[i].task_due_date,
          end: response.data[i].task_due_date,
          barColor: colour[response.data[i].task_type],
        })
      }
    })
    .catch((error) => {
        console.log(error);
    });


    setEvents(eventsToAdd)
  }

  console.log(events)

  const onEventClick = async (args) => {
    if (!calendar) return; // Ensure calendar is set
  
    // Prompt for event name
    const name = prompt("Enter event name:", args.e.text());
    if (!name) return;
  
    // Prompt for start time
    const startTime = prompt("Enter start time (format: YYYY-MM-DD HH:MM):", args.e.start());
    if (!startTime) return;
  
    // Prompt for end time
    const endTime = prompt("Enter end time (format: YYYY-MM-DD HH:MM):", args.e.end());
    if (!endTime) return;
  
    // Update the event with the new information
    const e = args.e;
    e.data.text = name;
    e.start(startTime);
    e.end(endTime);
  
    calendar.events.update(e);
  };

  const onTimeRangeSelected = async (args) => {
    if (!calendar) return;
  
    const name = prompt("New event/activity name:", "Event");
    if (!name) return;
  
    let eventType = ""; // Declare eventType outside the loop
  
    while(true){
      eventType = prompt("Select event type:\n1. Event\n2. Activity", "1");
      if (!eventType) return;
      if(eventType ==="1" || eventType ==="2") break;
      else {
        alert("Invalid input. Please either enter 1 or 2");
      }
    }
  
    let barColor = "#38761d"; // Default color for Summative event type
  
    // Set bar color based on event type
    if (eventType === "2") {
      // Exam event type
      barColor = "#ff0000"; // Red color for Exam event type
    }

    
  
    const newEvent = {
      id: generateUniqueId(),
      text: name,
      start: args.start,
      end: args.end,
      barColor: barColor,
    };
  
    setEvents([...events, newEvent]);
  
    // Clear the selection (if any)
    calendar.clearSelection();
  
    // Display a message
    calendar.message("Created");
  };

const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const previousWeek = () => {
  if (calendar) {
    calendar.startDate = calendar.startDate.addDays(-7);
    calendar.update();
  }
};

const nextWeek = () => {
  if (calendar) {
    calendar.startDate = calendar.startDate.addDays(7);
    calendar.update();
  }
};




  
return (
  <div className="w-full overflow-hidden h-screen">
    <div className={`${styles.flexCenter} pb-5`}>
      <NavBar />
    </div>

    <div className={`bg-dark ${styles.paddingX}`}>
      <div className="space text-white">
        Week:
        <button className="calendar-navigation-button text-white" onClick={previousWeek}>Previous</button>
        |
        <button className="calendar-navigation-button text-white" onClick={nextWeek}>Next</button>
      </div>
      <DayPilotCalendar
        viewType={"Week"}
        timeRangeSelectedHandling={"Enabled"}
        events={events}
        onEventClick={onEventClick}
        onTimeRangeSelected={onTimeRangeSelected}
        controlRef={setCalendar}
      />
    </div>
  </div>
);
}

export default StudyCalendar;