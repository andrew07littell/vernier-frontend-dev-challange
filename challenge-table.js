import { LitElement, html, css } from "lit";

export class ChallengeTable extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        background: white;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      tbody {
        display: block;
        max-height: 450px;
        overflow-x: auto;
      }
      thead,
      tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ccc;
      }
      th {
        background-color: #f4f4f9;
        color: #333;
        font-weight: bold;
      }
      tr:hover {
        background-color: #f5f5f5;
      }
      @media (max-width: 600px) {
        th,
        td {
          padding: 10px 8px;
        }
      }
    `;
  }

  static get properties() {
    return {
      tableName: { type: String },
      data: { type: Array },
    };
  }

  constructor() {
    super();
    this.tableName = "";
    this.data = [];
  }

  render() {
    return html`
      <table aria-label="Data display table">
        <thead>
          <tr>
            <th scope="col">X Value</th>
            <th scope="col">Y Value</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map(
            (dataRow) => html`
              <tr>
                <td>${dataRow[0].toFixed(2)}</td>
                <td>${dataRow[1].toFixed(2)}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}

window.customElements.define("challenge-table", ChallengeTable);
