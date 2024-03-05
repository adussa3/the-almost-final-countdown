import { useRef, useState } from "react";

import ResultModal from "./ResultModal";

export default function TimerChallenge({ title, targetTime }) {
    /*
        This fixes the issued explained in TimerChallenge_Without_useRef.jsx

        (1) useRef will retain it's value when the component is re-rendered
        (2) Every component instance will have it's own dedicated timer useRef!

        - similar state, React stores these refs behind the scenes
        - unlike state, the component does NOT re-render when ref is defined
    */
    const timer = useRef();

    /* 
        NOTE: using forwardRef has one small potential flaw, the problem is that the TimerChallenge Component (which uses the ResultModal
              component) in the end, needs to know that the dialog useRef will be attached to the <dialog> element in the ResultModal.

              In this tiny demo application where we are the only develop working on it, this isn't a problem because we wrote this code and
              we know what it does!

              But let's imagine that this is a large codebase with multiple developers where us and the developers write multiple components.
              We will be working with other components that other developers wrote and vice versa. If we always have to dive into those
              components to understand how they work internally so that we use them correctly, and we call the dialog.current.showModal()
              method, that can be a problem!

              This is because another developer could change the ResultModal from a <dialog> to a <div> element making it so that .showModal()
              will not work anymore!

              Instead, we use the useImperativeHandle Hook in the ResultModal component to expose it's own function to be called by
              the TimerChallenge component to open the modal

              This will work independently of how the JSX code in the ResultModal might change in the future. So that the person working
              on the ResultModal component can change it however they like AS LONG AS they keep one function that is exposed to the
              TimerChallenge component which it calls to open the modal instead of dialog.current.showModal() on the internal <dialog>
              element
    */
    // We're using this ref to PROGRAMMATICALLY open the dialog
    const dialog = useRef();

    // States
    const [didTimerStart, setDidTimerStart] = useState(false);
    const [isTimerExpired, setIsTimerExpired] = useState(false);

    const handleStart = () => {
        /*
            setTimeout() is used to set a timer in JavaScript
            It takes in a callback function and a delay, it executes the function after the timer expires

            RECALL: we need to use timer.current, we always must target this "current" property and set it equal to the timer
                    the "current" property will store this pointer at this "timer" returned by setTimeout/setInterval
        */
        timer.current = setTimeout(() => {
            // After the delay, we set isTimerExpired to true
            setDidTimerStart(false);
            setIsTimerExpired(true);

            // The TimerChallenge component dialog component is no longer attached to the <dialog> element in the ResultModal component
            // Instead, it refers to the object defined inside of the useImperativeHandle hook!
            // It calls the "open()" method in the object defined inside of the useImperativeHande hook
            dialog.current.open();
        }, targetTime * 1000);

        /*
            NOTE: setTimeout doesn't let us know how much time is left when the timer is stopped, so we need to use setInterval!
            setInterval will execute the function everytime the time expires (setTimout only execute the function once after the time expires)

            We don't want to set the targetTime as a time, but a very sort duration so that we can keep track of how much time expired!
            Therefore, we execute this function every 10 milliseconds
        */
        timer.current = setInterval(() => {}, 10);

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
        <>
            <ResultModal ref={dialog} targetTime={targetTime} result="lost" />
            <section className="challenge">
                <h2>{title}</h2>
                <p className="challenge-time">
                    {targetTime} second{targetTime > 1 ? "s" : ""}
                </p>
                <p>
                    <button onClick={didTimerStart ? handleStop : handleStart}>{didTimerStart ? "Stop" : "Start"} Challenge</button>
                </p>
                <p className={didTimerStart ? "active" : ""}>{didTimerStart ? "Time is running..." : "Timer inactive"}</p>
            </section>
        </>
    );
}
