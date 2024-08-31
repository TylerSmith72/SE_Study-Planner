import React, {useState, useEffect} from 'react';
import {NavBar} from '.';
import styles from '../style';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Accordian from './Accordion';

const Dashboard = () => {

  const [scheduleInfo, setScheduleInfo] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [deadlineInfo, setDeadlineInfo] = useState([]);
  const [tasksInfo, setTasksInfo] = useState([]);
  const [activitiesInfo, setActivitiesInfo] = useState([]);
  const [completedDeadlines, setCompletedDeadlines] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [missedDeadlines, setMissedDeadlines] = useState([]);


  useEffect(() => {
    getSchedules()
  }, []);

  const getTasksBySummativeId = (tasks, summativeId) => {
    let tasksInSchedule = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i]["summative_id_fkey"] == summativeId) {
        tasksInSchedule.push(tasks[i]);
      }
    }

    return tasksInSchedule;
  }

  const getActivitiesByTask = (activities, taskId) => {
    let activitiesForTask = [];
    for (let i = 0; i < activities.length; i++) {
      for (let j = 0; j < activities[i].length; j++) {
        if (activities[i][j]["task_id_fkey"] == taskId) {
          activitiesForTask.push(activities[i][j]);
        }
      }
    }

    return activitiesForTask;
  }

  const handleOption = (e) => {
    const selectedSchedule = e.target.value;
    setSelectedSemester(selectedSchedule);
    //console.log('Selected schedule:', selectedSchedule); // Log the selected value

    let summatives = [];
  
    //Get summatives
    let url = `http://localhost:4000/dashboard/deadlines/${selectedSchedule}`;
    let token = localStorage.getItem('token');
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `${token}`,
      },
    };
  
    axios
      .get(url, config)
      .then((response) => {
        setDeadlineInfo(response.data);
        summatives = response.data;
        //console.log('Deadline info:', response.data); // Log the response data
      })
      .catch((error) => {
        console.log('Error fetching deadlines:', error);
      });

    //Get tasks and activities
    url = `http://localhost:4000/taskinfo/tasks/${selectedSchedule}`;
    axios
      .get(url, config)
      .then(async (response) => {
        setTasksInfo(response.data);
        // console.log('Task info:', response.data); // Log the response data

        const theData = response.data;
        const body = {
          theData
        };
        //console.log(JSON.stringify(body));
        const token = localStorage.getItem('token');
        await fetch(
          "http://localhost:4000/activityinfo/activities/multipletasks",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `${token}`
            },
            body: JSON.stringify(body),
          }
        )
        .then((actResponse) => actResponse.json())
        .then((json) => {
          setActivitiesInfo(json);

          let tasks = response.data;
          let activities = json;
          let completed = [];
          let upcoming = [];
          let missed = [];
          //Sort deadlines into completed, upcoming or missed
          for (let s = 0; s < summatives.length; s++) {
            let deadlineTasks = getTasksBySummativeId(tasks, summatives[s]["summative_id"]);
            summatives[s]["tasks"] = deadlineTasks;
            //console.log(summatives[s]["tasks"]);
            //Work out if activity time of all tasks equals time attached to corresponding task
            let allTasksCompleted = true;
            let totalTasksTime = 0
            let totalTotalActivitiesTime = 0;
            for (let t = 0; t < deadlineTasks.length; t++) {
              totalTasksTime += deadlineTasks[t]["task_amount"];
              let taskActivities = getActivitiesByTask(activities, deadlineTasks[t]["task_id"]);
              let totalActivityTime = 0;
              for (let a = 0; a < taskActivities.length; a++) {
                totalActivityTime += taskActivities[a]["activity_amount"];
                //console.log(`activity amount: ${taskActivities[a]["activity_amount"]}`)
              }
              totalTotalActivitiesTime += totalActivityTime;
              summatives[s]["tasks"][t]["Percentage"] = parseInt(100*(totalActivityTime/deadlineTasks[t]["task_amount"]),10);

              //if total activity time doesn't equal task time
              if (totalActivityTime < deadlineTasks[t]["task_amount"]) {
                allTasksCompleted = false;
              }
            }

            //If not all tasks completed
            if (! allTasksCompleted) {
              //If deadline has passed, put in missed
              if  (new Date((summatives[s]["summative_due_date"])).getTime() - new Date().getTime() < 0) {
                let percent = (totalTotalActivitiesTime/totalTasksTime)*100;
                console.log(totalTotalActivitiesTime);
                console.log(totalTasksTime);
                console.log(`percent:  ${percent}`)
                summatives[s]["percent"] = percent;
                console.log(`percent:  ${summatives[s]["percent"]}`);
                missed.push(summatives[s]);
              }
              //If deadline is in future, put in upcoming
              else {
                let percent = (totalTotalActivitiesTime/totalTasksTime)*100;
                summatives[s]["percent"] = percent;
                upcoming.push(summatives[s]);
              }
            }
            //If all tasks completed, put in completed
            else {
              completed.push(summatives[s]);
            }
          }

          setCompletedDeadlines(completed);
          setUpcomingDeadlines(upcoming);
          setMissedDeadlines(missed);
          //console.log(`completed: ${completed}`);
          //console.log(`upcoming: ${upcoming}`);
          //console.log(`missed: ${missed}`);

        })
      })
      .catch((error) => {
        console.log('Error fetching tasks:', error);
      });
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
    <div className=" w-full h-screen">
      <div className={`${styles.flexCenter} pb-5`}>
          <NavBar />
      </div>

      <br></br>

      <div className='text-primary float-left ml-5 mr-5'>
        <Link to={`/semesteruploader`} className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}>
          Semester Uploader
        </Link>
      </div>

      <div className='text-primary float-left mr-5'>
          <Link to={`/addtask`} className={`text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800`}>
            Add Task
          </Link>
      </div>

      <div className='text-primary'>
          <Link to={`/addactivity`} className={`text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800`}>
            Add Activity
          </Link>
      </div>

      <br></br>
      {/* Schedule */}
      <div className="w-full px-6">
        <p className="text-gray-200 text-sm mb-2">CHOOSE SCHEDULE</p>
        {
          scheduleInfo.length > 0 &&
            <select
              id="Semester"
              name="Semester"
              onChange={handleOption}
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

      <div className='w-full flex flex-col sm:flex-row'>
        {/* Completed */}
        <div className={`${styles.paddingX} text-light w-full sm:w-1/3 inline-block h-screen align-top`}>
          <div className={`inline ${styles.heading2}`}>
            Completed
          </div>

          <div className={`${styles.dashBox}`}>
            <div className={`p-2`}>
            {
              completedDeadlines.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className='flow-root'>
                    <div className="text-2xl font-bold border-b border-b-gray-700 float-left">{item.module_code_fkey}: {item.summative_name}</div>
                    <div className='text-2xl font-bold border-b border-b-gray-700 float-right'>100%</div>
                  </div>
                  <div className='flow-root mt-3 mb-3'>
                      <div className='rounded-md bg-red-500 max-w-fit px-3 ml-2 float-right'>Due Date: {new Date(item.summative_due_date).toLocaleDateString()}</div>
                      <div className='rounded-md bg-green-500 max-w-fit px-3 ml-2 float-right'>Set Date: {new Date(item.summative_set_date).toLocaleDateString()}</div>
                      <div className='float-left'>Time Left: {
                        Math.ceil(
                          (new Date(item.summative_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        )} days
                      </div>
                  </div>
              
                  <Accordian title= "Tasks" color = {"text-2xl font-bold border-b border-b-gray-700"}>
                  {
                      item.tasks.map((task,tIndex) => (
                        <div>
                          <div className='flow-root mt-3 mb-3'>
                            <div className='float-left'>{task.task_name}</div>
                            <div className='float-right'> {task.Percentage}%</div>
                          </div>
                          <div className='border-b border-b-gray-700'>Description: {task.task_description}</div>
                        </div>

                      ))
                    }
                  </Accordian>
                </div>
              ))
            }
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className={`${styles.paddingX} text-light w-full sm:w-1/3 inline-block h-screen align-top`}>
          <div className={`inline ${styles.heading2}`}>
            Upcoming
          </div>

          <div className={`${styles.dashBox}`}>
            <div className={`p-2`}>
            {
              upcomingDeadlines.map((item, index) => (
              <div key={index} className="mb-4">
                <div className='flow-root border-b border-b-gray-700'>
                  <div className="text-2xl font-bold float-left">{item.module_code_fkey}: {item.summative_name}</div>
                  <div className='text-2xl font-bold float-right'>{parseInt(item.percent, 10)}%</div>
                </div>
                <div className='flow-root mt-3 mb-3'>
                  <div className='rounded-md bg-red-500 max-w-fit px-3 ml-2 float-right'>Due Date: {new Date(item.summative_due_date).toLocaleDateString()}</div>
                  <div className='rounded-md bg-green-500 max-w-fit px-3 ml-2 float-right'>Set Date: {new Date(item.summative_set_date).toLocaleDateString()}</div>
                  <div className='float-left'>Time Left: {
                    Math.ceil(
                      (new Date(item.summative_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )} days
                  </div>
                </div>
                <Accordian title= "Tasks" color = {"text-2xl font-bold border-b border-b-gray-700"}>
                {
                      item.tasks.map((task,tIndex) => (
                        <div>
                          <div className='flow-root mt-3 mb-3'>
                            <div className='float-left'>{task.task_name}</div>
                            <div className='float-right'> {task.Percentage}%</div>
                          </div>
                          <div className='border-b border-b-gray-700'>Description: {task.task_description}</div>
                        </div>

                      ))
                    }
                  </Accordian>
              </div>
              ))
            }
            </div>
          </div>
        </div>

        {/* Missed */}
        <div className={`${styles.paddingX} text-light w-full sm:w-1/3 inline-block h-screen align-top`}>
          <div className={`inline ${styles.heading2}`}>
            Missed
          </div>

          <div className={`${styles.dashBox}`}>
            <div className={`p-2`}>
            {
              missedDeadlines.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className='flow-root border-b border-b-gray-700'>
                    <div className="text-2xl font-bold float-left">{item.module_code_fkey}: {item.summative_name}</div>
                    <div className='text-2xl font-bold float-right'>{parseInt(item.percent, 10)}%</div>
                  </div>
                  <div className='flow-root mt-3 mb-3'>
                    <div className='rounded-md bg-red-500 max-w-fit px-3 ml-2 float-right'>Due Date: {new Date(item.summative_due_date).toLocaleDateString()}</div>
                    <div className='rounded-md bg-green-500 max-w-fit px-3 ml-2 float-right'>Set Date: {new Date(item.summative_set_date).toLocaleDateString()}</div>
                    <div className='float-left'>Time late: {
                      Math.ceil(
                        (new Date(item.summative_due_date).getTime() - new Date().getTime())*-1 / (1000 * 60 * 60 * 24)-1
                      )} days
                    </div>
                    <div className='pb-3 pt-10'>
                      <p>Description: </p>
                      {item.summative_description}
                    </div>
                  </div>
                  <Accordian title= "Tasks" color = {"text-2xl border-b border-b-gray-700"}>
                    {
                      item.tasks.map((task,tIndex) => (
                        <div>
                          <div className='flow-root mt-3 mb-3'>
                            <div className='float-left'>{task.task_name}</div>
                            <div className='float-right'> {task.Percentage}%</div>
                          </div>
                          <div className='border-b border-b-gray-700'>Description: {task.task_description}</div>
                        </div>

                      ))
                    }
                  </Accordian>
                </div>
              ))
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;