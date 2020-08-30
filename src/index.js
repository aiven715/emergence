import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import icon from "./icon.svg";

function World() {
  const [robots, setRobots] = useState([]);

  const addRobot = () => {
    setRobots((robots) => [
      ...robots,
      {
        id: robots.length,
        location: randomLocation()
      }
    ]);
  };

  console.log(robots);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobots((robots) =>
        robots.reduce((acc, robot) => {
          const step = {
            x: randomBetween(-10, 10),
            y: randomBetween(-10, 10)
          };

          const location = {
            x: robot.location.x + step.x,
            y: robot.location.y + step.y
          };

          const stopped = !shouldMove(location, acc);

          if (stopped) return acc;

          return acc.map((item) =>
            item.id !== robot.id ? item : { ...item, location }
          );
        }, robots)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={{ ...surface, border: "1px solid #ddd" }}>
        {robots.map((robot) => (
          <Robot key={robot.id} {...robot} />
        ))}
      </div>
      <br />
      <button onClick={addRobot}>Add robot</button>
    </>
  );
}

function Robot({ location }) {
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${location.x}px, ${location.y}px)`,
        transition: "translate .3s"
      }}
    >
      <img src={icon} alt="" />
    </div>
  );
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
    x: randomBetween(0, surface.width),
    y: randomBetween(0, surface.height)
  };
};

const randomBetween = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const surface = {
  width: 800,
  height: 1000
};


ReactDOM.render(<World />, document.getElementById("root"));
