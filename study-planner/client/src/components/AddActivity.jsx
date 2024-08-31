import React, { useState, useEffect } from "react";
import { NavBar } from ".";
import styles from "../style";
import axios from 'axios';

const AddActivity = () => {
    const [inputs, setInputs] = useState({});
    const [selectedSemester, setSelectedSemester] = useState('');
    const [scheduleInfo, setScheduleInfo] = useState([]);
    const [tasksInfo, setTasksInfo] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');

    useEffect(() => {
      getSchedules()
    }, []);
  
    const onChange = (e) => {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const handleScheduleOption = (e) => {
      const selectedSchedule = e.target.value;
      setSelectedSemester(selectedSchedule);
      setSelectedTask(0);
      console.log('Selected schedule:', selectedSchedule); // Log the selected value
    
      const url = `http://localhost:4000/taskinfo/tasks/${selectedSchedule}`;
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'content-type': 'application/json',
          Authorization: `${token}`,
        },
      };
    
      axios
        .get(url, config)
        .then((response) => {
          setTasksInfo(response.data);
        })
        .catch((error) => {
          console.log('Error fetching tasks:', error);
        });
    };

    const handleTaskOption = (e) => {
      const selectedTask = e.target.value;
      setSelectedTask(selectedTask);
    }
      
    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const name = inputs.name;
        const task = selectedTask;
        const time = inputs.time;
        const description = inputs.description;
        const body = {
          name,
          task,
          time,
          description
        };
        console.log(JSON.stringify(body));
        const token = localStorage.getItem('token');
        const response = await fetch(
          "http://localhost:4000/otherForm/addactivity",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `${token}`
            },
            body: JSON.stringify(body),
          }
        );
  
      } catch (err) {
        console.error(err.message);
      }
    };

    function getSchedules(){
      const url = 'http://localhost:4000/submitFile/getSchedule';
      const token = localStorage.getItem('token')
      const config = {
          headers: {
          'content-type': 'multipart/form-data',
          Authorization: `${token}`
          },
      };
  
      axios
      .get(url, config)
      .then((response) => {
          const scheduleData = response.data;
          setScheduleInfo(scheduleData);
      })
      .catch((error) => {
          console.log(error);
      });
    }
    
    return (
        <div className=" w-full">
          <div className={` ${styles.flexCenter} pb-5`}>
            <NavBar />
          </div>
            
          <div className="flex items-center justify-center">
            <form className="w-[50%] bg-dark bg-opacity-70 rounded-lg text-left px-10 py-6" onSubmit={onSubmit}>
              <div className="block text-sm font-medium leading-6 text-white">
                <p>Schedule</p>
                {
                  scheduleInfo.length > 0 &&
                  <select
                      id="Semester"
                      name="Semester"
                      onChange={handleScheduleOption}
                      className="h-full mb-5 rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
                      value={selectedSemester} // Set the selected value
                  >
                  <option value="0">Select a semester</option>
                  {
                    scheduleInfo.map((schedule, key) => (
                    <option key={key} value={schedule.schedule_id}>{schedule.schedule_name}</option>
                    ))
                  }
                  </select> 
                }
              </div>
              <div className="block text-sm font-medium leading-6 text-white">
                
                {
                  tasksInfo.length > 0 &&
                  <div className="w-1/3">
                    <p>Task</p>
                    <select
                        id="Task"
                        name="Task"
                        onChange={handleTaskOption}
                        className="h-full mb-5 rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
                        value={selectedTask} // Set the selected value
                    >
                    <option value="0">Select a task</option>
                    {
                      tasksInfo.map((task, key) => (
                      <option key={key} value={task.task_id}>{task.task_name}</option>
                      ))
                    }
                    </select> 
                  </div>
                } 
              </div>
              <div className="mb-5 block text-sm font-medium leading-6 text-white">
                Name
                <input 
                  type="text" 
                  name="name" 
                  value={inputs.name}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
              <div className="mb-5 block text-sm font-medium leading-6 text-white">
                Time (hours)
                <input 
                  type="text" 
                  name="time" 
                  value={inputs.time}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
              <div className="mb-5 block text-sm font-medium leading-6 text-white">
                Description
                <input 
                  type="text" 
                  name="description" 
                  value={inputs.description}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              </div>
              <div className="flex items-center justify-center px-80">
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    );
};
  
  export default AddActivity;