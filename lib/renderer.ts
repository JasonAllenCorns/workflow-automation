import * as vis from 'vis';
import * as _ from 'lodash';
import {Transition} from "./transition";
import {StateBase} from "./state_base";

export class Renderer {
    private nodes;
    private edges;

    private initialized: boolean;

    private init(container: HTMLElement, transitions: Transition[]) {
        var nodeArray = _.uniqBy(Transition.getStatesFromTransitions(transitions), 'uuid');
        this.nodes = new vis.DataSet(_.map(nodeArray, (state: StateBase) => {
            return {
                id: state.uuid,
                label: state.name,
                color: 'grey',
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

        var data = {
            nodes: this.nodes,
            edges: this.edges
        }

        new vis.Network(container, data, {
            interaction: {hover: true},
            layout: {
                hierarchical: {
                    direction: 'LR'
                }
            }
        });

        this.initialized = true;
    }

    public render(container: HTMLElement, transitions: Transition[]) {
        if (!this.initialized) {
            this.init(container, transitions);
        }

        var nodeArray = _.uniqBy(Transition.getStatesFromTransitions(transitions), 'uuid');
        this.nodes.update(_.map(nodeArray, (state: StateBase) => {
            return {
                id: state.uuid,
                color: state.isCurrent ? 'greenyellow' : (state.isDone ? 'green' : 'grey'),
            }
        }));

    }
}