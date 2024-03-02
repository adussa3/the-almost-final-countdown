import { useRef, useState } from "react";

export default function TimerChallenge({ title, targetTime }) {
    /*
        This fixes the issued explained in TimerChallenge_Without_useRef.jsx

        (1) useRef will retain it's value when the component is re-rendered
        (2) Every component instance will have it's own dedicated timer useRef!

        - similar state, React stores these refs behind the scenes
        - unlike state, the component does NOT re-render when ref is defined
    */
    const timer = useRef();

    const [didTimerStart, setDidTimerStart] = useState(false);
    const [isTimerExpired, setIsTimerExpired] = useState(false);

    const handleStart = () => {
        // setTimeout() is used to set a timer in JavaScript
        // It takes in a callback function and a delay, it executes the function after the timer expires

        // RECALL: we need to use timer.current, we always must target this "current" property and set it equal to the timer
        //         the "current" property will store this pointer at this "timer" returned by setTimeout
        timer.current = setTimeout(() => {
            // After the delay, we set isTimerExpired to true
            setDidTimerStart(false);
            setIsTimerExpired(true);
        }, targetTime * 1000);

        // We set didTimerStart to true when this function is executed
        setDidTimerStart(true);
    };

    const handleStop = () => {
        // JavaScript's clearTimeout() function is used to stop a timer,
        // but it needs a pointer (the id) to that timer
        //
        // Because we're using useRef, we clear the timer using timer.current
        clearTimeout(timer.current);

        setDidTimerStart(false);
        setIsTimerExpired(false);
    };

    return (
        <section className="challenge">
            <h2>{title}</h2>
            {isTimerExpired && <p>You lost</p>}
            <p className="challenge-time">
                {targetTime} second{targetTime > 1 ? "s" : ""}
            </p>
            <p>
                <button onClick={didTimerStart ? handleStop : handleStart}>{didTimerStart ? "Stop" : "Start"} Challenge</button>
            </p>
            <p className={didTimerStart ? "active" : ""}>{didTimerStart ? "Time is running..." : "Timer inactive"}</p>
        </section>
    );
}
