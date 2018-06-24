import * as vis from 'vis';
import * as _ from 'lodash';
import {Transition} from "./transition";
import {StateBase} from "./state_base";
import {RenderingOptions} from "./renderingOptions";

export class Renderer {
    private nodes;
    private edges;

    private initialized: boolean;

    private init(container: HTMLElement, transitions: Transition[], options: RenderingOptions) {
        var nodeArray = _.uniqBy(Transition.getStatesFromTransitions(transitions), 'uuid');
        this.nodes = new vis.DataSet(_.filter(_.map(nodeArray, (state: StateBase) => {
            if ((options.hideEnd && _.has(state, 'isEnd'))
                || (options.hideStart && _.has(state, 'isStart'))) {
                return null;
            }

            return {
                id: state.uuid,
                label: state.name,
                color: options.stateColor,
                shape: (_.has(state, 'isStart') || _.has(state, 'isEnd'))
                    ? 'circle'
                    : (_.has(state, 'isParallel')
                        ? 'diamond'
                        : (_.has(state, 'isCollectState')
                            ? 'triangleDown'
                            : 'square'))
            };
        }), state => state != null));

        this.edges = new vis.DataSet(_.filter(_.map(transitions, (trans: Transition) => {
            if ((options.hideEnd && _.has(trans.outState, 'isEnd'))
                || (options.hideStart && _.has(trans.inState, 'isStart'))) {
                return null;
            }

            return {
                from: trans.inState.uuid,
                to: trans.outState.uuid, arrows: 'to'
            };
        }), trans => trans != null));

        var data = {
            nodes: this.nodes,
            edges: this.edges
        }

        new vis.Network(container, data, {
            interaction: {
                hover: true,
                dragNodes: false,
                dragView: false,
            },
            layout: {
                hierarchical: {
                    direction: options.layoutDirection
                }
            }
        });

        this.initialized = true;
    }

    public render(container: HTMLElement, transitions: Transition[], options: RenderingOptions) {
        if (!this.initialized) {
            this.init(container, transitions, options);
        }

        var nodeArray = _.uniqBy(Transition.getStatesFromTransitions(transitions), 'uuid');
        this.nodes.update(_.filter(_.map(nodeArray, (state: StateBase) => {
            if ((options.hideEnd && _.has(state, 'isEnd'))
                || (options.hideStart && _.has(state, 'isStart'))) {
                return null;
            }
            return {
                id: state.uuid,
                color: state.isCurrent ? options.currentStateColor : (state.isDone ? options.doneStateColor : options.stateColor),
            }
        }), state => state != null));

    }
}