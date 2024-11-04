import React, { useState, useContext } from 'react';
import { EventsContext } from './EventContext';

const AddEventForm = () => {
  const { addEvent } = useContext(EventsContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { title, description, date, location };
    addEvent(newEvent);
    // Reset form fields if needed
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for title, description, date, location */}
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEventForm;