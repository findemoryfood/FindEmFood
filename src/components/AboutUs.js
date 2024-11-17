import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutUs.css';
import placeholderImage from '../assets/logo.png'; // Default placeholder for team images
import jazmin from '../assets/jazmin.png'
import ashley from '../assets/ashley.png'
import cassie from '../assets/cassie.png'
import david from '../assets/david.png'
import katie from '../assets/katie.png'
import michelle from '../assets/michelle.png'
import ryan from '../assets/ryan.png'

const teamMembers = [
    {
        name: "Ashley-Jordan Annoh",
        role: "Frontend Team",
        email: "aannoh@emory.edu",
        image: ashley,
    },
    {
        name: "Michelle Carpinteyro",
        role: "Database Team",
        email: "mcarpi2@emory.edu",
        image: michelle,
    },
    {
        name: "David Cruz",
        role: "Database Team",
        email: "david.cruz@emory.edu",
        image: david,
    },
    {
        name: "Cassie St. Felix",
        role: "Frontend Team",
        email: "rose.st.felix@emory.edu",
        image: cassie,
    },
    {
        name: "Katie Park",
        role: "GPS Team",
        email: "kjpark9@emory.edu",
        image: katie,
    },
    {
        name: "Ja’Zmin McKeel",
        role: "GPS Team",
        email: "jmckeel@emory.edu",
        image: jazmin,
    },
    {
        name: "Ryan Xu",
        role: "Frontend Team",
        email: "rxu67@emory.edu",
        image: ryan,
    },
];

const AboutUs = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const changeSlide = (index) => {
    setSliderIndex(index);
  };

  return (
    <div className="about-us-page">

      {/* Background Section with Slider */}
      <div className="container_slide">
        <div
          id="slider"
          style={{ transform: `translateX(-${sliderIndex * (100 / 3)}%)` }}
        >
          <div className="msg-col">
            <h1>PROJECT IDEA</h1>
            <p>
                Within the Emory campus, an abundance of events featuring complimentary food often
                correspond with significant food waste. For students seeking these events, the challenge
                lies in identifying these opportunities, which are usually scattered across various
                locations on Emory’s campus.

                To address this issue, we propose Find Em Food, a mobile application designed to connect
                Emory’s students with available food resources on campus. By utilizing GPS technology
                and real-time information on nearby free food events, we can guide users directly to
                these opportunities.

                The application will rely on user-generated submissions from verified Emory accounts,
                establishing a trustworthy platform that bridges event organizers with excess food and
                students. This initiative could not only alleviate hunger among students but also
                promote sustainability, minimizing food waste and fostering a sense of community on
                campus.
            </p>
          </div>
          <div className="msg-col">
            <h1>HOW DOES IT WORK?</h1>
            <p>
              Simple! Go to the GPS page and select your Food Event Destination!
            </p>
            <Link to="/GPS" className="links-style">Find A Free Food Event</Link>
          </div>
          <div className="msg-col">
            <h1>HOW CAN I ADD AN EVENT?</h1>
            <p>Register as an organizer and navigate to the FoodList page to add events.</p>
            <Link to="/OrgSignIn" className="links-style">Login / Signup Here</Link>
          </div>
        </div>
      </div>

      {/* Slider Controller */}
      <div className="controller">
        <div id="line1" onClick={() => changeSlide(0)}></div>
        <div id="line2" onClick={() => changeSlide(1)}></div>
        <div id="line3" onClick={() => changeSlide(2)}></div>

      </div>

      {/* About Us Cards */}
      <div className="about-us-row">
        {teamMembers.map((member, index) => (
          <div className="about-us-column" key={index}>
            <div className="about-us-card">
              <img src={member.image} alt={`${member.name}`} className="team-member-image" />
              <div className="about-us-card-container">
                <h2>{member.name}</h2>
                <p className="title">{member.role}</p>
                <p className="email">{member.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
