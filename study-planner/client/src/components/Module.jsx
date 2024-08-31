import React, {useState, useEffect} from 'react';
import {NavBar, Accordion} from '.';
import styles from '../style';
import axios from 'axios';

const Module = () => {

  const [moduleInfo, setModuleInfo] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState([]);

  useEffect(() => {
    getSchedules()
  }, []);

  const handleOption = (e) => {
    const selectedSchedule = e.target.value;
    setSelectedSemester(selectedSchedule);
    console.log('Selected schedule:', selectedSchedule); // Log the selected value
  
    const url = `http://localhost:4000/dashboard/modules/${selectedSchedule}`;
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
        setModuleInfo(response.data);
        //console.log('Deadline info:', response.data); // Log the response data
      })
      .catch((error) => {
        console.log('Error fetching modules:', error);
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

      <div className='rounded-lg overflow-hidden mx-10'>
        {
          moduleInfo.length > 0 &&
          moduleInfo.map((module, index) => (
            <div key = {index} className='bg-gray-800 bg-opacity-40 rounded-lg py-1 px-5 mb-5'>
              <Accordion title={module.module_name} color ="px-4 py-2 cursor-pointer items-center text-white">
                <div className='flow-root'>
                  <div className='rounded-md bg-green-500 max-w-fit px-3 float-left'>Start Date: {new Date(module.module_start_date).toLocaleDateString()}</div>
                  <div className='rounded-md bg-red-500 max-w-fit px-3 ml-2 float-left'>End Date: {new Date(module.module_end_date).toLocaleDateString()}</div>
                </div>
                <div className='text-bold'>Code: {module.module_code}</div>
                <div className='text-bold'>Description: {module.module_description}</div>
                <div className='text-bold'>Organiser: {module.module_organiser}</div>
                {/* Make new Accordion with Task info*/}
              </Accordion>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default Module