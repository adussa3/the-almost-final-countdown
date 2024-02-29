import { useRef } from "react";
import { useState } from "react";

/*
    Key difference between Ref and State!
    - When a Ref changes, the component function does NOT re-execute and re-render the 
    - When a State is updated with the state-updating function "set[State]", the component function DOES re-execute and re-renders the page
*/

export default function Player() {
    /*
        What are refs?

        From Reddit:
        useRef is like a box where you can store something. A number, an object, anything you want.
        This value is persisted between renders. So if you save in this box some value, it will be available in the next render.
        And unlike useState, changes in your useRef "box" does not trigger a new render.
        You can also use it to reference elements - almost like document.getElementById('foo')
        
        (RECALL: all React Hook functions must be called inside of a component function or inside of a custom hook)
    */
    // This ref value gets the value entered into the <input> field
    const playerName = useRef();

    const [enteredPlayerName, setEnteredPlayerName] = useState("unknown entity");

    const handleClick = () => {
        // The input element is connected to the ref prop!
        // For all these ref values created with useRef, you first have to access a "current" property
        //
        // This ref value will ALWAYS be a JavaScript object that will ALWAYS have the "current" property and ONLY a "current" property
        // and it's in this "current" property that the actual ref value will be stored!
        //
        // Therefore, the "current" property, in this case, holds the <input> element as a value, so you can access
        // all the methods and properties that are exposed by the <input> HTML element
        //
        // playerName.current.value holds the currently entered value in the input element!
        // we can use this value to update the enteredPlayerName useState!
        setEnteredPlayerName(playerName.current.value);

        // How should we clear the input when the button is clicked?
        // Remember, react is Declarative, setting playerName.current.value to "" is Imperative
        // Aparrently, we can consider writing code like this because overall it allows us to save a lot of code
        //
        // NOTE: this is ok in small cases, but in general, we should NOT use refs to read and manupulate values
        //       on our page because that's not the idea behind React
        //
        //       but if it can make your life easier, using refs is a great alternative to using state
        playerName.current.value = "";
    };

    return (
        <section id="player">
            {/* 
                NOTE:
                enteredPlayerName ?? "unknown entity" is the same as enteredPlayerName ? enteredPlayerName : "unknown entity"
             */}
            <h2>Welcome {enteredPlayerName ?? "unknown entity"}</h2>
            <p>
                {/*
                    We can connect refs into JSX elements! We can do this using the "ref" property,
                    which is supported by all React Components automatically

                    the "ref" prop is a special property (just like the key prop)! The ref prop takes
                    a ref value as an input
                    
                    In this case, it takes in playerName and connects this input element to the useRef

                    How does this connection help us?
                    Ans: we can use this ref value in handleClick to access the underlying connected element!
                         So through playerName, we can access this input element because playerName is connected
                         to it through the ref prop

                    This is one of the reasons why the ref feature exists! Where you want to read a value from an input field!
                */}
                <input ref={playerName} type="text" />
                <button onClick={handleClick}>Set Name</button>
            </p>
        </section>
    );

    /*
        This is how we set the player name WITHOUT useRef!
        This is NOT ideal! When you type in <input> it sets the "submitted" state to false
        and it set's the name back to "unknown entity" instead of the old value
    */
    // const [playerName, setPlayerName] = useState("unknown entity");
    // const [submitted, setSubmitted] = useState(false);
    // const handleChange = (event) => {
    //     setSubmitted(false);
    //     setPlayerName(event.target.value);
    // };
    // const handleClick = () => {
    //     setSubmitted(true);
    // };
    // return (
    //     <section id="player">
    //         <h2>Welcome {submitted ? playerName : "unknown entity"}</h2>
    //         <p>
    //             <input type="text" value={playerName} onChange={handleChange} />
    //             <button onClick={handleClick}>Set Name</button>
    //         </p>
    //     </section>
    // );
}
