export class RenderingOptions {

    constructor(public hideStart: boolean = false,
                public hideEnd: boolean = false,
                public currentStateColor: string = 'greenyellow',
                public doneStateColor: string = 'green',
                public stateColor: string = 'grey',
                public layoutDirection: string = 'LR') {

    }
}