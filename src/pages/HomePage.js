import { IoSettingsOutline } from "react-icons/io5";

function AddEventButton({ style }) {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick} style={{ ...style, width: '150px', height: '50px', fontSize: '25px', fontWeight: 'bold' }}>
      Add Event
    </button>
  );
}

function clicked() {
  alert('You clicked me!');
}

function HomePage() {
  return (
    // <div style={styles.container}>
    // <IoSettingsOutline onClick={clicked} size={50} style={styles.icon} />
    // <AddEventButton style={styles.button} />
    // </div>
    <p> </p>
  );
}

// css styles
const styles = {
  container: {
    position: 'relative',
    height: '100vh', // Full viewport height
    width: '100vw',  // Full viewport width
  },
  icon: {
    position: 'absolute',
    top: 5,     // Distance from the top
    left: 5,    // Distance from the left
  },
  button: {
    position: 'absolute',
    bottom: 10,  // Distance from the bottom
    left: 10,    // Distance from the left
  },
};

export default HomePage;