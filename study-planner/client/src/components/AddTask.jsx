import React, { useState, useEffect } from "react";
import { NavBar } from ".";
import styles from "../style";
import { Link } from "react-router-dom";
import axios from 'axios';

const AddTask = () => {
  const [inputs, setInputs] = useState({});
  const [selectedSemester, setSelectedSemester] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [moduleInfo, setModuleInfo] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [assessmentInfo, setAssessmentInfo] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    getSchedules()
  }, []);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  //Handle dropdown options
  const handleScheduleOption = (e) => {
    const selectedSchedule = e.target.value;
    setSelectedSemester(selectedSchedule);
    setSelectedModule(0);
    setSelectedAssessment(0);
    setSelectedType(0);


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
      })
      .catch((error) => {
        console.log('Error fetching tasks:', error);
      });
  };

  const handleModuleOption = (e) => {
    const selectedModule = e.target.value;
    setSelectedModule(selectedModule);
    console.log(selectedSemester);
    setSelectedAssessment(0);
    setSelectedType(0);
  
    const url = `http://localhost:4000/dashboard/summativesWithSchedule/${selectedModule}/${selectedSemester}`;
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
        setAssessmentInfo(response.data);
      })
      .catch((error) => {
        console.log('Error fetching tasks:', error);
      });
  };

  const handleAssessmentOption = (e) => {
    const selectedAssessment = e.target.value;
    setSelectedAssessment(selectedAssessment);
  }

  const handleTypeOption = (e) => {
    const selectedType = e.target.value;
    setSelectedType(selectedType);
  }
    
  //Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs.type);
    try {
      const name = inputs.name;
      const schedule = selectedSemester;
      const assessment = selectedAssessment;
      const type = selectedType;
      const time = inputs.time;
      const date = inputs.date;
      const description = inputs.description;
      const body = {
        name,
        schedule,
        assessment,
        type,
        time,
        date,
        description
      };
      console.log(JSON.stringify(body));
      const token = localStorage.getItem('token');
      const response = await fetch(
        "http://localhost:4000/otherForm/addtask",
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

  //Get user's schedules
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
      <div className="w-full flex items-center justify-center">
        <form className="w-[50%] bg-dark bg-opacity-70 rounded-lg text-left px-10 py-6" onSubmit={onSubmit}>
            <div className="">
              <div className="block text-sm font-medium leading-6 text-white">
                  <p>Schedule</p>
                  {
                    scheduleInfo.length > 0 &&
                    <select
                      id="Semester"
                      name="Semester"
                      onChange={handleScheduleOption}
                      className="mb-5 rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
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
              <div className="flex">
                {
                  moduleInfo.length > 0 &&
                  <div className="w-1/3 block text-sm font-medium leading-6 text-white">
                    <p>Module</p>
                    <select
                      id="module"
                      name="module"
                      onChange={handleModuleOption}
                      className="w-[80%] mr-5 mb-5 rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
                      value={selectedModule} // Set the selected value
                    >
                      <option value="0">Select a module</option>
                      {
                        moduleInfo.map((module, key) => (
                            <option key={key} value={module.module_code}>{module.module_name}</option>
                        ))
                      }
                    </select>
                  </div>
                }
                {
                  (moduleInfo.length > 0 && assessmentInfo.length > 0 && selectedModule.length > 0) &&
                  <div className="w-1/3 block text-sm font-medium leading-6 text-white">
                    <p>Assessment</p>
                    <select
                      id="assessment"
                      name="assessment"
                      onChange={handleAssessmentOption}
                      className="w-[80%] mr-5 mb-5 rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
                      value={selectedAssessment} // Set the selected value
                    >
                      <option value="0">Select an assessment</option>
                      {
                        assessmentInfo.map((assessment, key) => (
                          <option key={key} value={assessment.summative_id}>{assessment.summative_name}</option>
                        ))
                      }
                    </select> 
                  </div>
                }
                {
                  (moduleInfo.length > 0 && assessmentInfo.length > 0 && selectedAssessment.length > 0 && selectedAssessment > 0) && 
                  <div className="w-1/3 block text-sm font-medium leading-6 text-white">
                    <p>Type</p>
                    <select
                      id="type"
                      name="type"
                      onChange={handleTypeOption}
                      className="w-[80%] mr-5 mb-5 rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
                      value={selectedType} // Set the selected value
                    >
                      <option value="Programming">Programming</option>
                      <option value="Writing">Writing</option>
                      <option value="Reading">Reading</option>
                      <option value="Studying">Studying</option>
                      <option value="Other">Other</option>
                    </select> 
                  </div>
                }
              </div>
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
              Due Date
              <input 
                type="date" 
                name="date" 
                value={inputs.date}
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
            <div className="flex w-full items-center justify-center px-80">
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Submit</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
