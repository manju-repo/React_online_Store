import React, { useState } from 'react';
import classes from './tabs.css';

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className={classes.tabs}>
             <div className={classes.tabList}>
                {React.Children.map(children, (child, index) => (
                    <button style={{color:'black'}}
                        className={`${classes.tab} ${activeTab === index ? classes.active : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className={classes.tab_content}>
                {React.Children.map(children, (child, index) => (
                    index === activeTab ? child : null
                ))}
            </div>
        </div>
    );
};

const Tab = ({ children }) => {
    return (
        <div className={classes.tab}>
            {children}
        </div>
    );
};

export { Tabs, Tab };