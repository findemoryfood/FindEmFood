import React, {useState, useEffect} from 'react';
import '../styles/Home.css';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/*
const sections = [
  { id: 1,
    title: "Find Em' Food",
    subtitle: "Hub For Food Spots At Emory University",
    details: "Our platform helps students discover free food opportunities and contribute to sustainable initiatives. With live updates, GPS tracking, and intuitive filtering options, we’re making food access easy and impactful.",
    cta: "Explore Now",
     },

  { id: 2,
    title: "Food Waste Facts",
    subtitle: "30% of food in Atlanta goes to waste.",
    details: "Every year, over 100,000 pounds of edible food goes uneaten on college campuses. Let’s change that together.", },

  {  id: 3,
    title: "Top Contributors",
    subtitle: "See which organizations are reducing food waste.",
    leaderboard: [
      { name: "Environmental Club", contributions: "Saved 500 meals" },
      { name: "Student Government", contributions: "Donated 300 meals" },
      { name: "Questbridge", contributions: "Helped 200 students" },
    ], },
  {  id: 4,
    title: "GPS Locations",
    subtitle: "Find free food spots near you.",
    mapEmbed: "/images/map-placeholder.png",
    details: "Never miss out! Our interactive map shows all available food spots on campus, updated in real-time.", },

  { id: 5,
  title: "Our Initiative",
  subtitle: "Connecting students with food opportunities sustainably.",
  goals: [
    "Reduce food waste on campus.",
    "Provide access to meals for all students.",
    "Promote sustainable habits.",
  ],
  stats: { mealsSaved: 2000, wasteReduced: "10,000 lbs" },},
  { id: 6, id: 6,
    title: "Contact Us",
    subtitle: "Find Em Food | Emory University | findemfood@emory.edu",
    socialMedia: [
      { platform: "Instagram", link: "/instagram" },
      { platform: "Twitter", link: "/twitter" },
      { platform: "Facebook", link: "/facebook" },
    ],
    contactForm: true,} // Enables a contact form on this section },
];

const HomePage = () => {
  return (
    <div className="homepage">
      {sections.map((section) => (
        <div key={section.id} className={`section section-${section.id}`}>
          <h1>{section.title}</h1>
          <p>{section.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;*/

const HomePage = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const subtitles = [
    'Your Hub for Food Opportunities at Emory University',
    'Connecting Students with Food Resources',
    'Reducing Food Waste Sustainably',
  ];

  useEffect(() => {
    const typeText = async () => {
      const currentText = subtitles[subtitleIndex];
      let i = 0;
      setTypewriterText('');
      while (i <= currentText.length) {
        setTypewriterText((prev) => currentText.substring(0, i));
        i++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setTimeout(() => {
        setSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
      }, 3000);
    };
    typeText();
  }, [subtitleIndex]);

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="hero-title">Find Em' Food</h1>
        <p className="hero-subtitle">{typewriterText}</p>
        <div className="hero-buttons">
          <button className="cta-button pulse">Explore Features</button>
          <button className="cta-button outline shimmer">Learn More</button>
        </div>
      </div>

      <div className="features-section">
        <div className="feature fade-in">
          <h2>Find Food Quickly</h2>
          <p>Access real-time updates about free food spots across campus.</p>
        </div>
        <div className="feature fade-in">
          <h2>Reduce Waste</h2>
          <p>Join the movement to minimize food waste by sharing excess resources.</p>
        </div>
        <div className="feature fade-in">
          <h2>Support Community</h2>
          <p>Connect with organizations actively working to help students and reduce waste.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
