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
    const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);

    const isTimerActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

    // We manually stop the timer if it expired/time runs out! Not just when the stop button is pressed
    if (timeRemaining <= 0) {
        clearInterval(timer.current);
        dialog.current.open();
    }

    const handleReset = () => {
        setTimeRemaining(targetTime * 1000);
    };

    const handleStart = () => {
        /*
            RECALL: we need to use timer.current, we always must target this "current" property and set it equal to the timer
            the "current" property will store this pointer at this "timer" returned by setTimeout/setInterval

            NOTE: setTimeout doesn't let us know how much time is left when the timer is stopped, so we need to use setInterval!
            setInterval will execute the callback function everytime the time expires, while setTimout only execute the function
            once after the time expires

            We don't want to set the targetTime as a time, but a very short duration so that we can keep track of how much time expired!
            Therefore, we execute this function every 10 milliseconds
        */
        const millisecondsElapsed = 10;
        timer.current = setInterval(() => {
            setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - millisecondsElapsed);
        }, millisecondsElapsed);
    };

    const handleStop = () => {
        // JavaScript's clearInterval() function is used to stop a timer,
        // but it needs a pointer (the id) to that timer
        //
        // Because we're using useRef, we clear the timer using timer.current
        clearInterval(timer.current);
        dialog.current.open();
    };

    return (
        /*
            When you open the Developer Tools and look at the code in the "Elements" tab, you see the ResultModal component's dialog element
            is nested inside the "challenge" section

            Visually, there's nothing wrong with this, but technically, it would make more sense if the overlay element (which visually sits
            on top of the entire page) is located DIRECTLY inside the body, or maybe inside a div with an id of "modal"

            It makes sense to have a dialog on a higher level because that would map it's visual appearence because that would map it's visual
            appearence to its location in the HTML structure

            This can be better for accessibility reasons and can help you avoid styling problems and conflicts (especially for deeply nested
            elements)

            We want output the ResultModal component in the TimerChallenge component, but we want to move its JSX code to go somewhere else
            in our the page

            We can do this using Portals from the React DOM Library!
        */
        <>
            <ResultModal ref={dialog} targetTime={targetTime} remainingTime={timeRemaining} onReset={handleReset} />
            <section className="challenge">
                <h2>{title}</h2>
                <p className="challenge-time">
                    {targetTime} second{targetTime > 1 ? "s" : ""}
                </p>
                <p>
                    <button onClick={isTimerActive ? handleStop : handleStart}>{isTimerActive ? "Stop" : "Start"} Challenge</button>
                </p>
                <p className={isTimerActive ? "active" : ""}>{isTimerActive ? "Time is running..." : "Timer inactive"}</p>
            </section>
        </>
    );
}
