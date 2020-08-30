import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import icon from "./icon.svg";

function World() {
  const [robots, setRobots] = useState([]);

  const addRobot = () => {
    setRobots(robots => [
      ...robots,
      {
        id: robots.length,
        location: randomLocation()
      }
    ]);
  };

  const moveRobot = (id, getLocation) =>
    setRobots(robots =>
      robots.map(robot => {
        if (robot.id !== id) {
          return robot;
        }

        const location = getLocation();

        return {
          ...robot,
          location: {
            x: robot.location.x + location.x,
            y: robot.location.y + location.y
          }
        };
      })
    );

  return (
    <>
      <button
        style={{ position: "absolute", top: 10, left: 10 }}
        onClick={addRobot}
      >
        Add robot
      </button>
      {robots.map(robot => (
        <div
          style={{
            position: "absolute",
            transform: `translate(${robot.location.x}px, ${robot.location.y}px)`,
            transition: "translate .3s"
          }}
        >
          <Robot
            key={robot.id}
            onMove={getLocation => moveRobot(robot.id, getLocation)}
          />
        </div>
      ))}
    </>
  );
}

function Robot({ onMove }) {
  useEffect(() => {
    const interval = setInterval(() => {
      onMove(() => ({ x: randomBetween(-10, 10), y: randomBetween(-10, 10) }));
    }, 100);

    return () => clearInterval(interval);
    // TODO: onMove should be a dependency, but if move is changing - interval is cleared which is not desirable
  }, []);

  return <img src={icon} alt="" />;
}

const shouldMove = (location, robots) => {
  for (let robot of robots) {
    if (
      isClose(location.x, robot.location.x) ||
      isClose(location.y, robot.location.y)
    ) {
      return false;
    }
  }

  return true;
};

const isClose = (a, b) => Math.abs(a - b) < 10;

const randomLocation = () => {
  return {
    x: randomBetween(0, window.innerWidth - ROBOT_SIZE),
    y: randomBetween(0, window.innerHeight - ROBOT_SIZE)
  };
};

const randomBetween = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const ROBOT_SIZE = 32;

ReactDOM.render(<World />, document.getElementById("root"));
