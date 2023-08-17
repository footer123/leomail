import React from 'react';
import './Launch.css';
import ImageCarousel from "./ImageCarousel";
import {app_root} from "../Config";
import App from "../App";

function Launch() {



    return (
        <div className="launch">
            <Header />
            <Section id="introduce" >
                <Introduce />
            </Section>
            <Section id="roadmap">
                <Roadmap />
            </Section>
            <div className="launch-contact">
                <h2>Email: leomail901@gmail.com</h2>
            </div>
        </div>
    );
}

function Header() {
    const launchClick = () => {
        app_root.render(<App/>)
    }

    const titleClick = (title)=>{
        const targetElement = document.getElementById(title);
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <header className='launch-header'>
            <div className="logo">
                <img src='webicon.png'/>
            </div>
            <nav>
                <div onClick={()=>titleClick('introduce')}>Introduce</div>
                <div onClick={()=>titleClick('roadmap')}>Roadmap</div>
                <div onClick={launchClick}>Launch App</div>
            </nav>
        </header>
    );
}

function Section({ id, title, children }) {
    return (
        <div className="section" id={id}>
            <h2>{title}</h2>
            {children}
        </div>
    );
}

function Introduce() {
    const launchClick = () => {
        app_root.render(<App/>)
    }

    return (
        <div className="launch-introduce">
            <div className='launch-introduce-left'>
                <div>Welcome to</div>
                <div>Leo Mail</div>
                <h1>A privacy, security, and </h1>
                <h1>decentralization mail service base on </h1>
                <h1>ALEO Network.</h1>
                <button onClick={launchClick} className='launch-button'>Launch APP</button>
            </div>
            <div className='launch-introduce-right'>
                <ImageCarousel images={['intro1.png',"intro2.png"]}/>
            </div>

        </div>
    );
}

function Roadmap() {
    const tasks = [
        {
            title1:"2023Q3",
            title2: "Foundation Improvement and Functionality Development",
            items: [
                "Improve existing blockchain sending and receiving functions",
                "Optimize performance and response speed",
                "Enhance transaction security and privacy",
                "User Interface (UI) optimization and User Experience (UX) enhancement",
                "Develop basic email functionality",
                "Set email filtering, tagging, and archiving rules"
            ]
        },
        {
            title1: "2023Q4",
            title2: "Integration with Traditional Email Channels",
            items: [
                "Research interaction mechanisms with traditional emails",
                "API docking research with mainstream email service providers (e.g., Gmail, Outlook, etc.)",
                "Define security protocols for channels with traditional emails",
                "Develop synchronization functionality with traditional emails",
                "Conduct extensive testing to ensure stable and secure channels with traditional emails",
                "Collect user feedback and iterate for optimization"
            ]
        },
        {
            title1: "2024Q1",
            title2: "Functionality Completion and Promotion",
            items: [
                "Complete all functionalities",
                "Iterate and optimize functionalities developed in the first and second quarters",
                "Ultimate optimization of User Interface (UI) and User Experience (UX)",
                "Develop additional features (based on market demand and feedback) such as calendar integration, auto-reply settings, advanced search functions, etc.",
                "Promotion and market expansion",
                "Establish partnership relationships, collaborate with other blockchain and traditional technology companies",
                "Conduct market activities and advertising promotions"
            ]
        }
    ];

    return (
        <div className='launch-roadmap'>
            <div className='section-title'>RoadMap</div>
            <div className='launch-roadmap-right'>.</div>
            <div className='launch-roadmap-container'>
                <SubRoad quarter={tasks[0]}/>
                <SubRoad quarter={tasks[1]}/>
                <SubRoad quarter={tasks[2]}/>
            </div>

        </div>
    );



    function SubRoad(pros){
        const quarter = pros.quarter
        return (
            <div className='launch-roadmap-sub'>
                <h3>{quarter.title1}</h3>
                <h3>{quarter.title2}</h3>
                <ul>
                    {quarter.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        )
    }


}





function Contact() {
    return (
        <div className="launch-contact">
            <h2>Email: leomail901@gmail.com</h2>
        </div>
    );
}

export default Launch;
