import * as vis from 'vis';
import * as _ from 'lodash';
import { Transition } from "./transition";
import { StateBase } from "./state_base";

export class Renderer {
    private nodes;
    private edges;

    private initialized: boolean;

    public init(transitions: Transition[]) {
        var nodeArray = _.uniqBy(Transition.getStatesFromTransitions(transitions), 'uuid');
        this.nodes = new vis.DataSet(_.map(nodeArray, (state: StateBase) => {
            return {id: state.uuid, label: state.name};
        }));

        this.edges = new vis.DataSet(_.map(transitions, (trans: Transition) => {
            return {from: trans.inState.uuid, to: trans.outState.uuid, arrows: 'to'};
        }));

        this.initialized = true;
    }

    public render(container: HTMLElement) {
        if (!this.initialized) {
            throw new Error('call init() first');
        }

        var data = {
            nodes: this.nodes,
            edges: this.edges
        }

        new vis.Network(container, data);

    }
}