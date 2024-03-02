import { useState } from "react";

/*
    Now the "let timer" variable, will retain it's value becase it's NOT being re-rendered inside of the component function!

    But now there's another problem! If you start two TimeChallenge's while another one is active and stop both of them, the
    first TimeChallenge you start will print "You lost"

    Because the "let timer" variable is defined OUTSIDE of the component function, all the TimeChallenged use THE SAME VARIABLE!
    This means the "let timer" variable will ONLY store the last started TimerChallenge and ignore the previous started TimerChallenges!

    IMPORTANT!
    You need to use useRefs! To fix this!!!

    useRefs allows you to:
    - connect to HTML elements (but not why we want to use it in this case)
    - manage any kind of value inside the component function! (this is what we want)
*/
let timer;

export default function TimerChallenge({ title, targetTime }) {
    const [didTimerStart, setDidTimerStart] = useState(false);
    const [isTimerExpired, setIsTimerExpired] = useState(false);

    /*
        Problem: the timer keeps running and prints "You lost" even when you press the Stop Challenge button
                 and set isTimerExpired to false!

                 Somehow the timer is not stopped! And the problem is that we're using  the "let timer" variable!
                 Whenever state changes, the component is re-rendered! This means that the "let timer" variable is also re-rendered!
                 Because it's initialized inside the component function, the timer used in handleStop will be a DIFFERENT timer in handleStop

                 Basically, it will be set to "undefined" because it's not set being set when it's re-rendered

                 NOTE: we could use the "let timer" variable if we define it OUTSIDE of the component function

    */
    // let timer;

    const handleStart = () => {
        // setTimeout() is used to set a timer in JavaScript
        // It takes in a callback function and a delay, it executes the function after the timer expires
        timer = setTimeout(() => {
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
        clearTimeout(timer);

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
