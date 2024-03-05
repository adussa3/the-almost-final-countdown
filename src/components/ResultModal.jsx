import { forwardRef, useImperativeHandle, useRef } from "react";

/*
    NOTE: You CANNOT pass a ref to a Custom Component as a property!
    Instead you have to use a special React function called "forwardRef"

    forwardRef - forwards a ref from one component to another, so that ref can be used in the other component

    To use forwardRef, you need to wrap it around the component function
    Instead passing "ref" inside the destructured "prop", we pass it in as a second parameter in the ResultModel function.

    NOTE: Even if you're not passing in any attributes, you still need to pass in something in the first parameter!
          Otherwise, it doesn't work! ref needs to be the second parameter
*/
const ResultModal = forwardRef(function ResultModal({ targetTime, remainingTime, onReset }, ref) {
    // This useRef will bind to the <dialog> element!
    const dialog = useRef();

    const didUserLose = remainingTime <= 0;
    const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
    const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

    /*
        The useImperativeHandle hook is used to define properties and methods that should be accessible on this component
        from OUTSIDE this component!

        Note: we won't be using this hook too often, because in most cases we should prefer working with "props" and so on
              But for use cases like this, the useImperativeHandle hook makes the ResaultModal component more stable and reusable

        useImperativeHandle needs two arguments:
        (1) the first argument must be a ref passed it! So useImperativeHandle is meant to work together with forwardRef
        (2) the second argument is a function that returns on object which groups all the properties and methods that should be exposed
            by the ResultModal component to other components!
    */
    useImperativeHandle(ref, () => {
        return {
            // NOTE: this is a shorthand way of writing open: () => dialog.current.showModal();
            // When the open method is called, it opens the dialog modal
            open() {
                dialog.current.showModal();
            },
        };
    });

    return (
        /*
            By default the dialog box is invisible, but adding the "open" attribute makes it visible

            However! forcefully opening the dialog doesn't give it a dimmed background overlay agains the screen.

            Instead we have to PROGRAMMATICALLY open the dialog to get the dimmed overlay background. This is where Refs can help us!
        */

        /*
            We're using the dialog ref defined in the ResultModal component! NOT the dialog ref in the TimerChallenge component!
            We detach the TimerChallenge component from the <dialog> element component in ResultModal component
        */
        <dialog ref={dialog} className="result-modal" onClose={onReset}>
            {didUserLose && <h2>You lost!</h2>}
            {!didUserLose && <h2>Your score: {score}!</h2>}
            <p>
                The target time was <strong>{targetTime} seconds.</strong>
            </p>
            <p>
                You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong>
            </p>
            {/*
                When a form's method is dialog, the state of the form is saved but not submitted, and the dialog gets closed.
                A button that "submits" the form will CLOSE the dialog!
            */}
            <form method="dialog" onSubmit={onReset}>
                {/* This button CLOSES the dialog */}
                <button>CLOSE</button>
            </form>
        </dialog>
    );
});

export default ResultModal;
