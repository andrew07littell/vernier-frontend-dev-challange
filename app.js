import { LitElement, html, css } from "lit";
import "./challenge-chart/dist/challenge-chart.js";
import "./challenge-table.js";
import { ChallengeDataService } from "./ChallengeDataService.js";

class ChallengeApp extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 0 auto;
        padding: 10px;
      }
      .container {
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        gap: 30px;
        margin: 30px;
      }
      .chart-container {
        flex: 1 1 50%;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .table-container {
        flex: 1 1 auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      button {
        background-color: #6200ea;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        outline: none;
      }
      button:hover,
      button:focus {
        background-color: #3700b3;
        transform: translateY(-6px);
      }
      button:active {
        background-color: #3700b3;
        transform: translateY(3px);
      }
      @media (max-width: 768px) {
        .container {
          flex-wrap: wrap;
        }
        .chart-container,
        .table-container {
          flex: 1 1 100%;
        }
        button {
          width: calc(100% - 60px);
          margin: 10px 30px;
        }
      }
    `;
  }
  static get properties() {
    return {
      data: { type: Array },
      dataSetName: { type: String },
      streaming: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.dataService = new ChallengeDataService();
    this.data = [];
    this.dataSetName = "";
    this.streaming = false;
  }

  fetchData(size) {
    if (this.streaming) {
      this.stopStreaming();
    }
    this.dataService.getDataSet(size).then((dataset) => {
      this.dataSetName = dataset.name;
      this.data = dataset.xColumn.values.map((x, i) => ({
        x,
        y: dataset.yColumn.values[i],
      }));
      this.requestUpdate();
    });
  }

  startStreaming(rate) {
    if (!this.streaming) {
      this.streaming = true;
      this.data = [];
      this.dataService.startStreaming(rate, (x, y) => {
        this.data = [...this.data, { x, y }];
        this.requestUpdate();
      });
    }
  }

  stopStreaming() {
    if (this.streaming) {
      this.dataService.stopStreaming();
      this.streaming = false;
    }
  }

  render() {
    return html`
      <button @click="${() => this.fetchData("small")}">Load Small Data</button>
      <button @click="${() => this.fetchData("medium")}">
        Load Medium Data
      </button>
      <button @click="${() => this.fetchData("large")}">Load Large Data</button>
      <button @click="${() => this.startStreaming(10)}">Start Streaming</button>
      <button @click="${() => this.stopStreaming()}">Stop Streaming</button>
      <div class="container">
        <div class="chart-container">
          <challenge-chart
            .data="${this.data}"
            .streaming="${this.streaming}"
          ></challenge-chart>
        </div>
        <div class="table-container">
          <challenge-table
            .tableName="${this.dataSetName}"
            .data="${this.data.map((item) => [item.x, item.y])}"
          ></challenge-table>
        </div>
      </div>
    `;
  }
}

customElements.define("challenge-app", ChallengeApp);
