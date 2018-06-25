import { Component, OnInit } from '@angular/core';
import {RenderingOptions, Workflow} from "workflow-automation";
import * as _ from "lodash";
import {StateBase} from "workflow-automation/dist/lib/state_base";

@Component({
  selector: 'app-simple-workflow-import',
  templateUrl: './simple-workflow-import.component.html',
  styleUrls: ['./simple-workflow-import.component.scss']
})
export class SimpleWorkflowImportComponent implements OnInit {

  public workflowObject = {};
  private workflow: Workflow;
  private renderingOptions: RenderingOptions;
  private container: HTMLElement;

  constructor() { }

  ngOnInit() {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_126tzss" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.16.0">\n' +
      '  <bpmn:process id="Process_1" isExecutable="true">\n' +
      '    <bpmn:startEvent id="StartEvent_1">\n' +
      '      <bpmn:outgoing>SequenceFlow_16ni87v</bpmn:outgoing>\n' +
      '    </bpmn:startEvent>\n' +
      '    <bpmn:task id="Task_1pvgli5" name="state 1">\n' +
      '      <bpmn:incoming>SequenceFlow_16ni87v</bpmn:incoming>\n' +
      '      <bpmn:outgoing>SequenceFlow_1tear2f</bpmn:outgoing>\n' +
      '    </bpmn:task>\n' +
      '    <bpmn:sequenceFlow id="SequenceFlow_16ni87v" sourceRef="StartEvent_1" targetRef="Task_1pvgli5" />\n' +
      '    <bpmn:task id="Task_1anpirs" name="state 2">\n' +
      '      <bpmn:incoming>SequenceFlow_1tear2f</bpmn:incoming>\n' +
      '      <bpmn:outgoing>SequenceFlow_0skct4h</bpmn:outgoing>\n' +
      '    </bpmn:task>\n' +
      '    <bpmn:sequenceFlow id="SequenceFlow_1tear2f" sourceRef="Task_1pvgli5" targetRef="Task_1anpirs" />\n' +
      '    <bpmn:endEvent id="EndEvent_1bq9q5d">\n' +
      '      <bpmn:incoming>SequenceFlow_0skct4h</bpmn:incoming>\n' +
      '    </bpmn:endEvent>\n' +
      '    <bpmn:sequenceFlow id="SequenceFlow_0skct4h" sourceRef="Task_1anpirs" targetRef="EndEvent_1bq9q5d" />\n' +
      '  </bpmn:process>\n' +
      ' \n' +
      '</bpmn:definitions>';

    this.workflow = new Workflow();
    this.workflow.import(xml);
    this.workflow.namespace = 'SimpleImport';

    this.workflow.init(this.workflowObject);

    this.container = document.getElementById('visSimpleImport');
    this.workflow.render(this.container, this.renderingOptions);
  }

  next() {
    this.workflow.next();
    this.workflow.render(this.container, this.renderingOptions);
  }

  public toString(states: StateBase[]){
    if (states != null && states.length > 0) {
      return _.map(states, (item: StateBase) => item.name);
    }
  }
}
