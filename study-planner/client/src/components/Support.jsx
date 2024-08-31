import React from 'react';
import {NavBar} from '.';
import styles from '../style';
import Accordian from './Accordion';

const Support = () => {
  return (
    <div className=" w-full overflow-hidden h-screen">
      <div className={`${styles.flexCenter} pb-5`}>
          <NavBar />
      </div>
      
      <div className={`${styles.paddingX}`}>
        <h3 className ="text-white text-4xl font-bold mb-5">FAQs</h3>
        <div>
          <div className='bg-gray-800 rounded-lg py-1 px-5 mb-5'>
            <Accordian title = "How to create your own event?" color = {"text-white my-5 cursor-pointer"}>
              <p>
              By dragging across the cells on the calendar, you can create multiple events simultaneously.
              </p>
            </Accordian>
          </div>
          
          <div className='bg-gray-800 rounded-lg py-1 px-5 mb-5'>
            <Accordian title = "How to create an event where there is another event scheduled at the same time?" color = {"text-white my-5 cursor-pointer"}>
              <p>
              The calendar allows users to add multiple events simultaneously.
              </p>
            </Accordian>
          </div>

          <div className='bg-gray-800 rounded-lg py-1 px-5 mb-5'>
            <Accordian title = "How do I edit or update an existing event?" color = {"text-white my-5 cursor-pointer"}>
              <p>
              To edit an existing event, simply click it!
              </p>
            </Accordian>
          </div>
          
          <div className='bg-gray-800 rounded-lg py-1 px-5'>
            <Accordian title = "how do I go to next week or previous week? " color = {"text-white my-5 cursor-pointer"}>
              <p>
              Use the "Previous" and "Next" buttons located above the calendar.
              </p>
            </Accordian>`
          </div>
        </div>
        <div className='flex items-center justify-center w-full h-full my-5'>
          <address className='text-lg text-white font-poppins'>
          If you need further support email us at: <a href="mailto:studyplanner123@outlook.com" className='text-white hover:text-gray-400'>studyplanner123@outlook.com</a>
          </address>
        </div>
      </div>
    </div>
  )
}

export default Support