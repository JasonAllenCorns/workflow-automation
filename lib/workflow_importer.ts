import {xml2js} from 'xml-js';
import * as _ from 'lodash';
import {Transition} from "./transition";
import {Start} from "./start";
import {End} from "./end";
import {StateBase} from "./state_base";
import {SimpleState} from "./simple_state";

export class WorkflowImporter {
    public import(bpmnXml: string): Transition[] {

        var bpmnDescription = xml2js(bpmnXml, {
            compact: true,
            ignoreComment: true,
            alwaysChildren: true,
            nativeType: true,
            ignoreDoctype: true
        });

        var process = bpmnDescription['bpmn:definitions']['bpmn:process'];

        var transitions = this.convertTransitions(process['bpmn:sequenceFlow'], process['bpmn:startEvent'], process['bpmn:endEvent'], process['bpmn:task']);

        return transitions;
    }

    private convertTransitions(transDescriptions: any[], startDescription: any, endDescription: any, stateDescriptions: any[]): Transition[] {

        stateDescriptions.push(startDescription);
        stateDescriptions.push(endDescription);

        var states: StateBase[] = [];
        var transitions: Transition[] = [];

        _.forEach(transDescriptions, item => {

            var sourceStateDescription = item['_attributes']['sourceRef'];
            var sourceState = _.find(states, (state: StateBase) => state['ref'] === sourceStateDescription);

            if (sourceState == null) {
                var stateDescription = _.find(stateDescriptions, value =>
                    value['_attributes']['id'] == sourceStateDescription && item['_attributes']['id'] == value['bpmn:outgoing']['_text']
                );

                var stateId = stateDescription['_attributes']['id'];

                if (!_.has(stateDescription, 'bpmn:incoming')) {
                    sourceState = new Start(stateId);
                }
                else {
                    sourceState = new SimpleState(stateDescription['_attributes']['name']);
                    sourceState['ref'] = stateId;
                }
                states.push(sourceState);
            }


            var targetStateDescription = item['_attributes']['targetRef'];
            var targetState = _.find(states, (state: StateBase) => state['ref'] === targetStateDescription);
            if (targetState == null) {
                var stateDescription = _.find(stateDescriptions, value =>
                    value['_attributes']['id'] == targetStateDescription && item['_attributes']['id'] == value['bpmn:incoming']['_text']
                );

                var stateId = stateDescription['_attributes']['id'];

                if (!_.has(stateDescription, 'bpmn:outgoing')){
                    targetState = new End(stateId);
                }
                else {
                    targetState = new SimpleState(stateDescription['_attributes']['name']);
                    targetState['ref'] = stateId;
                }

                states.push(targetState);
            }

            var trans = new Transition(item['_attributes']['id'], sourceState, targetState);
            transitions.push(trans);
        })

        _.forEach(transitions, (item: Transition) => {
            item.inState['ref']=null;
            item.outState['ref']=null;
        })

        return transitions;
    }
}