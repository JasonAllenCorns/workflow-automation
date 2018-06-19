import * as vis from 'vis';
import * as _ from 'lodash';
import {Transition} from "./transition";
import {StateBase} from "./state_base";

export class Renderer {
    private nodes;
    private edges;


    public init(transitions: Transition[]) {
        var nodeArray = _.uniqBy(Transition.getStatesFromTransitions(transitions), 'uuid');
        this.nodes = new vis.DataSet(_.map(nodeArray, (state: StateBase) => {
            return {
                id: state.uuid,
                label: state.name,
                color: state.isCurrent ? 'greenyellow' : (state.isDone ? 'green' : 'white'),
                shape: (_.has(state, 'isStart') || _.has(state, 'isEnd'))
                    ? 'circle'
                    : (_.has(state, 'isParallel')
                        ? 'diamond'
                        : (_.has(state, 'isCollectState')
                            ? 'triangleDown'
                            : 'square'))
            };
        }));

        this.edges = new vis.DataSet(_.map(transitions, (trans: Transition) => {
            return {
                from: trans.inState.uuid,
                to: trans.outState.uuid, arrows: 'to'
            };
        }));
    }

    public render(container: HTMLElement, transitions: Transition[]) {
        this.init(transitions);


        var data = {
            nodes: this.nodes,
            edges: this.edges
        }

        new vis.Network(container, data, {
            interaction: {hover: true}
        });

    }
}