import React from 'react';


const FlowHeader = ({ title, subtitle }) => {
  return (
    <div id="FlowHeader" className='flow-header'>
      <div>
        <h2 className="header-title">{title}</h2>
        <h5 className="header-subtitle ">{subtitle}</h5>
      </div>
    </div>
  );
};

export default FlowHeader;
