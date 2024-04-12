import { LitElement, html } from 'lit';
import './challenge-chart/dist/challenge-chart.js';
import './challenge-table.js';
import { ChallengeDataService } from './ChallengeDataService.js';

class ChallengeApp extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
      dataSetName: { type: String }
    };
  }

  constructor() {
    super();
    this.dataService = new ChallengeDataService();
    this.data = [];
    this.dataSetName = '';
  }

  fetchData(size) {
    this.dataService.getDataSet(size).then(dataset => {
      this.dataSetName = dataset.name;
      this.data = dataset.xColumn.values.map((x, i) => ({
        x,
        y: dataset.yColumn.values[i]
      }));
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <button @click="${() => this.fetchData('small')}">Load Small Data</button>
      <button @click="${() => this.fetchData('medium')}">Load Medium Data</button>
      <button @click="${() => this.fetchData('large')}">Load Large Data</button>
      <challenge-chart .data="${this.data}"></challenge-chart>
      <challenge-table .tableName="${this.dataSetName}" .data="${this.data.map(item => [item.x, item.y])}"></challenge-table>
    `;
  }
}

customElements.define('challenge-app', ChallengeApp);
