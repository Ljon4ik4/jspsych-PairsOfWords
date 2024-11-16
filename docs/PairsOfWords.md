# PairsOfWords

matching task with two pairs of words, connection is realized by dragging in a 2x2 grid, works both on touchscreens and computers with mice

## Parameters

In addition to the [parameters available in all plugins](https://jspsych.org/latest/overview/plugins.md#parameters-available-in-all-plugins), this plugin accepts the following parameters. Parameters with a default value of undefined must be specified. Other parameters can be left unspecified if the default value is acceptable.

| Parameter           | Type             | Default Value      | Description                              |
| ------------------- | ---------------- | ------------------ | ---------------------------------------- |
|                     |                  |                    |                                          |

## Data Generated

In addition to the [default data collected by all plugins](https://jspsych.org/latest/overview/plugins.md#data-collected-by-all-plugins), this plugin collects the following data for each trial.

| Name      | Type    | Value                                    |
| --------- | ------- | ---------------------------------------- |
|           |         |                                          |

## Install



## Examples

An example is provided in the Examples folder, it uses a few of jsPsychs default plugins and the PairsOfWords plugin



## Structure of /src/index.ts

In the beginning the parameters passed to a trial are described:
* stimulustop: an array of stimuli for the top row of the grid, only values stimulustop[0], stimulustop[1] are used
* stimulusbottom: an array of stimuli for the top row of the grid, only values stimulusbottom[0], stimulusbottom[1] are used
* bottomswitch: a boolean value indicating whether the bottom items should be displayed in a switched way
* buttonlabel, the label of the 'continue' button.
* trial duration: is there a time limit
* response_ends_trial: does the trial end directly on fillout

the trial method starts with defining the innerhtml to be injected.
Then the labels of the divs a,b,c,d are replaced by the stimuli and the button label by what is passed to the method.

Then a few functions are described which allow painting lines on screen.
In fact there are only 2 lines (linea, lineb) being 'moved' by changing their css style. 
* lineplace changes an arbirary div in a way that it looks like a line between the indicated points
* getCenter/gettop/getbottom get coordinates from objects
* lineFromA, lineFromB do lineplace with linea,lineb and fixed starting coordinates
* resetlines reduces linea,lineb to a point, making them invisible
* verticalanswer/diagonalanswer paint the lines between a,b,c,d correspondingly
* determinelines processes the event of two stimuli being connected, repaints the lines and returns the corresponding result value ('v' for vertical 'd' for diagonal and '' for no appropriate lines)

* Then a few functions treating touch/mousevents are defined, one has to be careful that the target of the touchup is the element where one started with and on mouseup it is the element one currently is over. Here in particular in the mouse-events an internal variiable is hidden in the tag of the empty div, to remember where the current-being-painted line actually started.

* there rest is more or less default jspsych stuff

## Todos:

Currently the plugin is running, the following things should be changed:

1. Proper documentation should be added (including this readme file, the main readme file)
2. typescript/ jscript naming conventions should be implemented, maybe with an overall refracturing
3. currently mouseevents and touchevents are handled quite differently, maybe these should be united
4. The styling/ css is currently hardcoded, this should be changed 
5. the lines appearing are implemented by divs which are rotated in a weird way (following https://stackoverflow.com/questions/14560302/html-line-drawing-without-canvas-just-js), which is not a conceptually pleasing solution
6. an intermediate variable of what was clicked on last is handled as a tag in an empty div, because it was not clear to the author how inject a global variable via the innerHtml that he has access to (this is only relevant for mouseevents not touchevents) apparently one can define vars, since the var response is used later, so this should be easy to fix.
7. trial duration != null could lead to unpredictable behaviour, because it is not implemented what should be passed on if currently nothing is matched.
8. currently the lines are attached to the bottom of a,b, (resp. the top of c,d) because for unclear reasons they are above the stimuli (even though by their z-values they should not), this should also be fixed.
9. Some (at least elementary) testing should be introduced
