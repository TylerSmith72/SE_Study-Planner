import React, {useState, useEffect} from 'react';
import { NavBar, CreateSchedule } from '.';
import { close, reload} from '../assets';
import Popup from 'reactjs-popup';
import styles from '../style';
import axios from 'axios';

const SemesterUploader = () => {
    
    const [file, setFile] = useState()
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [open, setOpen] = useState(false);
    const [scheduleInfo, setScheduleInfo] = useState([]);

    useEffect(() => {
        getSchedules();
      }, []);

    const isValidFileUploaded=(file)=>{
        const validExtensions = 'application/json'
        return validExtensions.includes(file.type);
    }

    const handleOption = (e) => {
        setSelectedSemester(e.target.value);
    };

    const handleChange = (e) => {
        if (e.target.files){
            setFile(e.target.files[0])
        }
        if(!isValidFileUploaded(e.target.files[0])){
            setErrorMessage('Please upload a JSON file!');
            setHasError(true);
        } else {
            setErrorMessage('');
            setHasError(false);
        }
    }

    function reloadSemesters(event) {
        event.preventDefault()
        getSchedules();
    }

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

    function handleSubmit(event) {
        event.preventDefault()
        const url = 'http://localhost:4000/submitFile/upload';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('scheduleId', selectedSemester)
        const token = localStorage.getItem('token')
        const config = {
            headers: {
            'content-type': 'multipart/form-data',
            Authorization: `${token}`
            },
        };

        axios
        .post(url, formData, config)
        .then((response) => {
            //console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });

        location.reload()
    }

    function showScheduleInserter(event){
        event.preventDefault()
        setOpen(!open);
    }

    return (
        <div className=" w-full overflow-hidden h-screen">
            <div className={`${styles.flexCenter} pb-5`}>
                    <NavBar />
            </div>

            <div className={`${styles.paddingX} w-full flex items-center justify-center`}>
                <div className='w-[30%] min-w-fit rounded-lg overflow-hidden shadow-lg bg-dark bg-opacity-70 px-10 py-5'> 
                    <form className='w-full h-full min-w-fit'>
                        <p className="text-gray-200 text-xl font-bold mb-5 "> SEMESTER UPLOADER </p>
                            <div className="w-full">
                                <p className="text-gray-200 text-sm mb-2">CHOOSE SCHEDULE</p>
                                <div className='flow-root my-5'>
                                    {
                                        scheduleInfo.length > 0 ? 
                                            <select
                                                id="Semester"
                                                name="Semester"
                                                onChange={handleOption}
                                                className="w-1/2 min-w-fit float-left align-middle rounded-md border-0 bg-gray-100 py-0 pl-2 pr-7 text-gray-500"
                                                value={selectedSemester} // Set the selected value
                                            >
                                                <option value='0'>Select a semester</option>
                                            {
                                                scheduleInfo.map((schedule, key) => (
                                                    <option key={key} value={schedule.schedule_id}>{schedule.schedule_name}</option>
                                                ))
                                            }
                                            </select> 
                                        : 
                                        <div className="mx-5 w-1/2 float-left align-middle font-poppins text-red-500 text-xl font-bold">No Schedules Available,<br></br> Please Create One!</div>
                                    }
                                    <img src={reload} onClick={reloadSemesters} className='float-left cursor-pointer w-[28px] h-[28px] mx-2'></img>
                                    <button onClick={showScheduleInserter} className={`w-[40%] float-right align-middle focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}>Create Schedule</button>
                                </div>
                            </div>
                            <input type="file" onChange={handleChange} className="mb-5 w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-400 file:hover:bg-gray-500 file:text-white rounded" />
                        <div className='flex items-center justify-center'>
                        {hasError ? null : 
                            <div>
                                {open ? 
                                    <div className='popup rounded overflow-hidden shadow-xl bg-gray-600 p-5 flow-root'>
                                        <img src={close} onClick={showScheduleInserter} className='float-right'></img>
                                        <CreateSchedule/>
                                    </div> :
                                    <button type='submit' onClick={handleSubmit} className={`focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-large rounded-lg text-base px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}>Upload</button>
                                }
                            </div>
                        }
                        
                        {errorMessage && <p className="text-red-500 text-xl font-bold">{errorMessage}</p>}
                        </div> 
                    </form>
                </div>
            </div>

        </div>
    );
};

export default SemesterUploader;