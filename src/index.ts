import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = <const>{
  name: "PairsOfWords",
  parameters: {
    /** The stimuli of the first type to be displayed */
    stimulustop: {
      type: ParameterType.STRING,
      pretty_name: "top-row",
      default: undefined,
      array: true,
    },
    /** The stimuli of the second type to be displayed */
    stimulusbottom: {
      type: ParameterType.STRING,
      pretty_name: "bottom-row",
      default: undefined,
      array: true,
    },
    bottomswitch: {
      type: ParameterType.BOOL,
      pretty_name: "Is the parallel response correct?",
      default: undefined,
      array: false,
    },
    buttonlabel: {
      type: ParameterType.STRING,
      pretty_name: "button-label",
      default: "Next",
      array: false,
    },
    /** How long to show the trial. */
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: "Trial duration",
      default: null,
    },
    /** If true, then trial will end when user responds. */
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: "Response ends trial",
      default: false,
    },
  },
};

type Info = typeof info;

/**
 * PairsOfWords
 * jsPsych plugin for a matching task with two pairs of words, connection is realized by dragging in a 2x2 grid, works both on touchscreens and computers with mice
 * @author Leonid Ryvkin
 */
class PairsOfWordsPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const html: string = `
    <style>
    .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 100px);
        grid-row-gap: 40%;
        grid-column-gap: 20%;
        margin: 10%;
        position: fixed;
        top: 10%;
        left: 0;
        bottom:30%;
        right:0;
        max-width:800px;
    }
    .box {
        border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        background-color: white;
        z-index: 2;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      #bottomButton {
        width: calc(100% - 20%);
        padding: 20px;
        background-color: #007bff;
        color: white;
        text-align: center;
        box-sizing: border-box;
        cursor: pointer;
        position: fixed;
        bottom: 10%;
        left: 10%;
        right: 10%;
        z-index: 3;
        display: none;
        max-width: 800px;
    }


    @media screen and (max-height: 500px) and (orientation: landscape) {
      .container {
        margin-top:0%;
        grid-template-rows: repeat(2, 70px);
        padding:10px;

    }
    #bottomButton {
      bottom: 5%;
  }
  }


</style>
<div id="myframe">
    <div class="container">
        <div class="box" id="a">

        </div>
        <div class="box" id="b">

        </div>
        <div class="box" id="c">

        </div>
        <div class="box" id="d">

        </div>
    </div>

    <div id="linea" style=""></div>
    <div id="lineb" style=""></div>
    <div id="empty" style=""></div>

    <div id="bottomButton">
    Weiter
</div>
  </div>

    `;

    display_element.innerHTML = html;
    display_element.addEventListener('touchmove', function(e) {
      // Prevent pull-to-refresh behavior
      e.preventDefault();
  });

    const myframe: HTMLElement = document.getElementById("myframe")!;
    const a: HTMLElement = document.getElementById("a")!;
    const b: HTMLElement = document.getElementById("b")!;
    const c: HTMLElement = document.getElementById("c")!;
    const d: HTMLElement = document.getElementById("d")!;

    a.innerHTML = trial.stimulustop[0];
    b.innerHTML = trial.stimulustop[1];
    c.innerHTML = trial.bottomswitch ? trial.stimulusbottom[1] : trial.stimulusbottom[0];
    d.innerHTML = trial.bottomswitch ? trial.stimulusbottom[0] : trial.stimulusbottom[1];

    const button = document.getElementById("bottomButton") as HTMLElement;
    button.innerHTML = trial.buttonlabel;

    // Function to place a line
    const linePlace = (line: HTMLElement, x1: number, y1: number, x2: number, y2: number): void => {
      if (x2 < x1) {
        let tmp: number;
        tmp = x2;
        x2 = x1;
        x1 = tmp;
        tmp = y2;
        y2 = y1;
        y1 = tmp;
      }
      const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const m = (y2 - y1) / (x2 - x1);

      const degree = (Math.atan(m) * 180) / Math.PI;
      line.style.cssText = `z-index: 1; transform-origin: top left; transform: rotate(${degree}deg); width: ${lineLength}px; height: 5px; background: black; position: absolute; top: ${y1}px; left: ${x1}px;`;
    };

    // Function to get the center of an element
    const getCenter = (element: HTMLElement): { x: number; y: number } => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return { x: centerX, y: centerY };
    };
    // replacing it with top and bottom of elements, because there is some css problem
    const getbottom = (element: HTMLElement): { x: number; y: number } => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height;
      return { x: centerX, y: centerY };
    };

    const gettop = (element: HTMLElement): { x: number; y: number } => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top;
      return { x: centerX, y: centerY };
    };

    // Function to draw line from point A
    const lineFromA = (x: number, y: number): void => {
      const linea = document.getElementById("linea");
      const acenter = getbottom(document.getElementById("a"));
      if (linea instanceof HTMLElement) {
        linePlace(linea, acenter.x, acenter.y, x, y);
      }
    };

    // Function to draw line from point B
    const lineFromB = (x: number, y: number): void => {
      const lineb = document.getElementById("lineb");
      const bcenter = getbottom(document.getElementById("b"));
      if (lineb instanceof HTMLElement) {
        linePlace(lineb, bcenter.x, bcenter.y, x, y);
      }
    };

    // Function to reset lines
    const resetLines = (): void => {
      document.getElementById("bottomButton").style.display = "none";
      const acenter = getbottom(document.getElementById("a"));
      const bcenter = getbottom(document.getElementById("b"));
      lineFromA(acenter.x, acenter.y);
      lineFromB(bcenter.x, bcenter.y);
    };

    // Function to handle vertical answer
    const verticalAnswer = (): void => {
      const ccenter = gettop(document.getElementById("c"));
      const dcenter = gettop(document.getElementById("d"));
      lineFromA(ccenter.x, ccenter.y);
      lineFromB(dcenter.x, dcenter.y);
    };

    // Function to handle diagonal answer
    const diagonalAnswer = (): void => {
      const ccenter = gettop(document.getElementById("c"));
      const dcenter = gettop(document.getElementById("d"));
      lineFromA(dcenter.x, dcenter.y);
      lineFromB(ccenter.x, ccenter.y);
    };

    // Function to determine lines
    const determineLines = (whereAmI: HTMLElement, whereWasI: HTMLElement): string => {
      if (whereAmI == null || whereWasI == null) {
        resetLines();
        return "";
      }
      if (
        (whereAmI.id === "c" && whereWasI.id === "a") ||
        (whereAmI.id === "d" && whereWasI.id === "b")
      ) {
        verticalAnswer();
        document.getElementById("bottomButton").style.display = "inline-block";
        return "Parallel";
      }
      if (
        (whereAmI.id === "c" && whereWasI.id === "b") ||
        (whereAmI.id === "d" && whereWasI.id === "a")
      ) {
        diagonalAnswer();
        document.getElementById("bottomButton").style.display = "inline-block";
        return "Cross";
      }
      resetLines();
      return "";
    };

    const startmouselines = (e: MouseEvent) => {
      const internalVar = document.getElementById("empty");
      resetLines();
      if (internalVar) {
        internalVar.dataset.internalId = (e.target as HTMLElement).id;
      }
    };

    const endmouselines = (e: MouseEvent) => {
      //this should be mouseup but that event is often not triggering
      const internalVar = document.getElementById("empty");
      if (internalVar && internalVar.dataset.internalId !== "") {
        resetLines();
        const whereAmI = e.target as HTMLElement;
        const whereWasI = document.getElementById(internalVar.dataset.internalId);
        const reply = determineLines(whereAmI, whereWasI);
        if (reply != "") {
          after_response(reply);
        }
        internalVar.dataset.internalId = "";
      }
    };

    const touchmoving = (e: TouchEvent) => {
      const touchObj = e.changedTouches[0];
      const x2 = touchObj.clientX;
      const y2 = touchObj.clientY;
      if (e.target instanceof HTMLElement) {
        if (e.target.id === "a") {
          lineFromA(x2, y2);
        }
        if (e.target.id === "b") {
          lineFromB(x2, y2);
        }
      }
    };

    const touchending = (e: TouchEvent) => {
      const touchObj = e.changedTouches[0];
      const x2 = touchObj.clientX;
      const y2 = touchObj.clientY;
      const pointarray = document.elementsFromPoint(x2, y2);
      const filteredarray = pointarray.filter((el) => {
        return (
          (el as HTMLElement).className == "box" || (el as HTMLElement).className == "container"
        );
      });
      const whereAmI =
        filteredarray.length === 0
          ? (pointarray[0] as HTMLElement)
          : (filteredarray[0] as HTMLElement);
      const whereWasI = e.target as HTMLElement;
      const reply = determineLines(whereAmI, whereWasI);
      if (reply != "") {
        after_response(reply);
      }
    };

    a.addEventListener("mousedown", (e: MouseEvent): void => {
      startmouselines(e);
    });
    b.addEventListener("mousedown", (e: MouseEvent): void => {
      startmouselines(e);
    });
    c.addEventListener("mousemove", (e: MouseEvent): void => {
      endmouselines(e);
    });
    d.addEventListener("mousemove", (e: MouseEvent): void => {
      endmouselines(e);
    });
    a.addEventListener("touchstart", (e: TouchEvent) => {
      resetLines();
    });
    b.addEventListener("touchstart", (e: TouchEvent) => {
      resetLines();
    });
    a.addEventListener("touchmove", (e: TouchEvent) => {
      touchmoving(e);
    });
    b.addEventListener("touchmove", (e: TouchEvent) => {
      touchmoving(e);
    });
    a.addEventListener("touchend", (e: TouchEvent) => {
      touchending(e);
    });
    b.addEventListener("touchend", (e: TouchEvent) => {
      touchending(e);
    });

    myframe.addEventListener("mousemove", (e: MouseEvent): void => {
      const internalVar = document.getElementById("empty");
      const dataInternalId = internalVar.dataset.internalId;
      if (internalVar.dataset.internalId == "") {
        return;
      }
      const x2 = e.clientX;
      const y2 = e.clientY;
      if (dataInternalId === "a") {
        lineFromA(x2, y2);
        return;
      }
      if (dataInternalId === "b") {
        lineFromB(x2, y2);
        return;
      }
    });

    myframe.addEventListener("mouseup", (e: MouseEvent): void => {
      const internalVar = document.getElementById("empty");
      if (internalVar.dataset.internalId != "") {
        resetLines();
        internalVar.dataset.internalId = "";
      }
    });

    button.addEventListener("mousedown", (e: MouseEvent): void => {
      end_trial();
    });
    button.addEventListener("touchdown", (e: MouseEvent): void => {
      end_trial();
    });

    // start time
    var start_time = performance.now();

    // store response
    var response = {
      rt: null,
      answer: null,
      rtlist: [],
      answerlist: [],
    };

    // function to end trial when it is time
    const end_trial = () => {
      // kill any remaining setTimeout handlers
      var end_time = performance.now();
      var rt = Math.round(end_time - start_time);
      response.rt = rt;
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        stimulustop: trial.stimulustop,
        stimulusbottom: trial.stimulusbottom,
        bottomswitch: trial.bottomswitch,
        rt: response.rt,
        response: response.answer,
        rtlist: response.rtlist,
        answerlist: response.answerlist,
        correct:
          (response.answer == "Parallel" && trial.bottomswitch == false) ||
          (response.answer == "Cross" && trial.bottomswitch == true),
      };

      // clear the display
      display_element.innerHTML = "";

      // move on to the next trial
      this.jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    function after_response(reply) {
      // measure rt
      var end_time = performance.now();
      var rt = Math.round(end_time - start_time);
      response.answer = reply;
      response.rt = rt;
      response.answerlist.push(reply);
      response.rtlist.push(rt);

      if (trial.response_ends_trial) {
        end_trial();
      }
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
    }
  }
}

export default PairsOfWordsPlugin;
