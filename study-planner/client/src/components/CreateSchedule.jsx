import React, {useState} from 'react';
import styles from '../style';
import axios from 'axios';

const CreateSchedule = () => {

    const [scheduleName , setScheduleName] = useState('');

    const handleScheduleName = (e) => {
        setScheduleName(e.target.value)
    }

    function insertSchedule(event) {
        event.preventDefault()
        const url = 'http://localhost:4000/submitFile/insertSchedule';
        const token = localStorage.getItem('token');
        const config = {
            headers: {
            'content-type': 'application/json',
            Authorization: `${token}`
            }
        };

        const dataSchedule = { scheduleName: scheduleName }

        axios
        .post(url, dataSchedule, config)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });

    }

    return (
        <div className={`${styles.paddingX} flex items-center justify-center`}>
            <div className=''>
                <form className='w-full max-w-xs'>
                    <p className="text-gray-200 text-xl font-bold mb-5 "> CREATE SCHEDULE </p>
                    <input type="text" onChange = {e => handleScheduleName(e)} value={scheduleName} className="mb-5 px-3 w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"/>
                    <button type='submit' onClick={insertSchedule} className={` focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateSchedule;