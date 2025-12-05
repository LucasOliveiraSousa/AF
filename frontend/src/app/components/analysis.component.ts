import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../services/api.service';
import { Balance, CategorySummary } from '../models';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="analysis-container">
      <h2>Análise Financeira</h2>

      <div class="balance-cards">
        <div class="balance-card income">
          <h3>Receitas</h3>
          <p class="amount">R$ {{ balance.totalIncome.toFixed(2) }}</p>
        </div>
        <div class="balance-card expense">
          <h3>Despesas</h3>
          <p class="amount">R$ {{ balance.totalExpense.toFixed(2) }}</p>
        </div>
        <div class="balance-card" [ngClass]="balance.balance >= 0 ? 'positive' : 'negative'">
          <h3>Saldo</h3>
          <p class="amount">R$ {{ balance.balance.toFixed(2) }}</p>
        </div>
      </div>

      <div class="chart-container">
        <h3>Distribuição de Despesas por Categoria</h3>
        <div *ngIf="categorySummary.length > 0; else noData">
          <canvas 
            baseChart 
            [type]="'pie'" 
            [data]="pieChartData" 
            [options]="pieChartOptions"
            [plugins]="pieChartPlugins">
          </canvas>
          
          <div class="summary-table">
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Percentual</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of categorySummary">
                  <td>
                    <span class="category-badge" [style.backgroundColor]="item.color">
                      {{ item.name }}
                    </span>
                  </td>
                  <td>R$ {{ item.amount.toFixed(2) }}</td>
                  <td>{{ getPercentage(item.amount) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ng-template #noData>
          <p class="no-data">Nenhuma despesa registrada ainda.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .analysis-container {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    h3 {
      color: #333;
      margin-bottom: 15px;
    }

    .balance-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .balance-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .balance-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
    }

    .balance-card.income {
      border-top: 4px solid #4CAF50;
    }

    .balance-card.expense {
      border-top: 4px solid #f44336;
    }

    .balance-card.positive {
      border-top: 4px solid #2196F3;
    }

    .balance-card.negative {
      border-top: 4px solid #FF9800;
    }

    .amount {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .chart-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .chart-container canvas {
      max-width: 400px;
      margin: 0 auto;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 40px 20px;
    }

    .summary-table {
      margin-top: 30px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: #f0f0f0;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    tr:hover {
      background-color: #f9f9f9;
    }

    .category-badge {
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  `]
})
export class AnalysisComponent implements OnInit {
  balance: Balance = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  };

  categorySummary: CategorySummary[] = [];

  pieChartData: any;
  pieChartOptions: ChartConfiguration['options'];
  pieChartPlugins: any;

  constructor(private apiService: ApiService) {
    this.initializePieChart();
  }

  ngOnInit(): void {
    this.loadBalance();
    this.loadCategorySummary();
  }

  loadBalance(): void {
    this.apiService.getTotalBalance().subscribe({
      next: (response: any) => {
        this.balance = response.data || {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0
        };
      },
      error: (error) => console.error('Erro ao carregar saldo:', error)
    });
  }

  loadCategorySummary(): void {
    this.apiService.getSummaryByCategory().subscribe({
      next: (response: any) => {
        this.categorySummary = response.data || [];
        this.updatePieChart();
      },
      error: (error) => console.error('Erro ao carregar resumo por categoria:', error)
    });
  }

  initializePieChart(): void {
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    this.pieChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    };
  }

  updatePieChart(): void {
    if (this.categorySummary.length === 0) {
      return;
    }

    this.pieChartData = {
      labels: this.categorySummary.map(item => item.name),
      datasets: [
        {
          data: this.categorySummary.map(item => item.amount),
          backgroundColor: this.categorySummary.map(item => item.color),
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    };
  }

  getPercentage(amount: number): number {
    const total = this.balance.totalExpense;
    if (total === 0) return 0;
    return Math.round((amount / total) * 100);
  }
}
