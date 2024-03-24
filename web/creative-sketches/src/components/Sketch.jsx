import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./Sketch.css";

function Sketch() {
    const controlsRef = useRef(null);
    const [exists, setExists] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        async function loadSketch() {
            const check = document.getElementsByTagName("canvas");
            console.log('canvas check : ', check);
            try {
                const { default: sketch } = await import(`./s${id}`);
                new p5(sketch);
                setExists(true);
            } catch (error) {
                console.error("Error loading sketch:", error);
            }
        }
        
        if (!exists) {
            console.log(exists);
            loadSketch();
        }

    }, []);

    return (
        <div className="container">
            <div className="details">
                <h3 className="details_sketch_no">Nature of Code | <span style={{ fontWeight: 700 }}>No {id}</span></h3>
                <h4 className="date">Apr 8 2022</h4>
                <h1 className="details_title">Simple Wave On Both Axes</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum? </p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
            </div>
            <div id="controls" ref={controlsRef}>
                <h3>Controls</h3>
            </div>
            <footer>
                <h3 style={{ fontWeight: 400, margin: "0rem 0rem 1.3rem -7rem" }}>
                    Made with ❤ by
                    <a href="https://github.com/Vishvam10" className="github_link">Vishvam</a>
                </h3>
            </footer>
        </div>
    );
}

export default Sketch;
