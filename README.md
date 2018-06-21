# workflow-automation

Workflow-automation will be running complex workflows on browsers and servers. 
Based on NEA (nondeterministic finite automaton) you can handle parallel running states. 
The workflow functionality is based on tokens. If a state has min. 1 token. The next transition to the following state can be called.
The whole library is written in TypeScript.

## Badges
[![Build Status](https://travis-ci.org/kostkams/workflow-automation.svg?branch=master)](https://travis-ci.org/kostkams/workflow-automation)
[![Coverage Status](https://coveralls.io/repos/github/kostkams/workflow-automation/badge.svg)](https://coveralls.io/github/kostkams/workflow-automation)

## Installation
Install via npm:

    $ npm install workflow-automation
    
Install via yarm:

    $ yarn add workflow-automation
    
## Load

To use the workflow component, import the javascript file:

```js
import { Workflow } from 'workflow-automation';
```

## Example

A simple example can be found in the 'example' folder. The following code samples are written in TypeScript.

**Create a linear workflow**

```js
import { 
    Workflow, 
    Start, 
    End,
    SimpleState,
    Transition
} from 'workflow-automation';

// create the workflow object
var workflow = new Workflow();

// create start and end
var start = new Start('start');
var end = new End('end');

// create a simple state between start and end
var state = new SimpleState('state');

// create transitions from start to state to end
var transition1 = new Transition('trans1', start, state);
var transition2 = new Transition('trans2', state, end);

// create workflowObject. It contains the current status of the workflow
var workflowObject = {};

// initialize the workflow
workflow.transitions = [transition1, transition2];
workflow.namespace = 'example';
workflow.init(workflowObject);

// call next() to go to the next state
workflow.next();
```

## Build

To build the library from source, clone the project from github

    $ git clone https://github.com/kostkams/workflow-automation.git
    
To install all dependencies and build the library, run `yarn install` in the root of the project.

    $ cd workflow-automation
    $ yarn install
    
Then, build the project

    $ yarn run build
    
To automatically rebuild on changes in the source files

    $ yarn run watch

## Test

To test the library, install the project dependencies once:

    $ yarn install
    
Then run the tests

    $ yarn run test
    
To run the code cover: (It will create a html site)

    $ yarn run cover-local

## Licence

Copyright (C) 2018 by mkostka

workflow-automation is licenced under

* MIT License
https://opensource.org/licenses/MIT
