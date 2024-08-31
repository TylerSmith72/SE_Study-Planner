import React, {useState} from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Accordian = ({ title, children, color}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
          <div 
            //className="px-4 py-2 cursor-pointer flex justify-between items-center bg-gray-700"
            className = {`${color} flow-root`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {
              isOpen ? <div className="m-w-fit pb-2 font-poppins font-normal text-xl text-white float-left">{title}</div>
              :
              <div className="m-w-fit font-poppins font-normal text-xl text-white float-left">{title}</div>
            }
            
            <div>
              {isOpen ? <ArrowDropDownIcon className="transform rotate-180 text-white float-right" /> : <ArrowDropDownIcon  className="text-white float-right"/>}
            </div>
          </div>
          {isOpen && <div className= {color}>{children}</div>}
        </div>
      );
};

export default Accordian;