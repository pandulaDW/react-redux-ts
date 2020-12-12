import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { start, stop, selectDateStart } from "../redux/recorder";
import "../styles/Recorder.css";

const addZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

const Recorder = () => {
  const dispatch = useDispatch();
  const dateStart = useSelector(selectDateStart);
  const started = dateStart !== "";
  let interval = React.useRef<number>(0); // to make interval variable persists after render
  const [, setCount] = React.useState<number>(0); // force a re-render at each interval

  const handleClick = () => {
    if (started) {
      window.clearInterval(interval.current);
      dispatch(stop());
    } else {
      dispatch(start());
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  // clearing the interval when unmounting the element from the dom
  React.useEffect(() => {
    return () => window.clearInterval(interval.current);
  }, []);

  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0;
  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
  seconds -= hours * 60 * 60;
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;

  return (
    <div className={cx("recorder", { "recorder-started": started })}>
      <button onClick={handleClick} className="recorder-record">
        <span></span>
      </button>
      <div className="recorder-counter">{`${addZero(hours)}:${addZero(
        minutes
      )}:${addZero(seconds)}`}</div>
    </div>
  );
};

export default Recorder;
