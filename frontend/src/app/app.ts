import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TransactionsListComponent } from './components/transactions-list.component';
import { CategoriesComponent } from './components/categories.component';
import { AnalysisComponent } from './components/analysis.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    HttpClientModule,
    TransactionsListComponent,
    CategoriesComponent,
    AnalysisComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1>💰 Gestor Financeiro AF</h1>
          <p>Controle suas finanças pessoais</p>
        </div>
      </header>

      <nav class="app-nav">
        <button 
          (click)="currentTab = 'transactions'" 
          [class.active]="currentTab === 'transactions'"
          class="nav-btn">
          📊 Movimentações
        </button>
        <button 
          (click)="currentTab = 'analysis'" 
          [class.active]="currentTab === 'analysis'"
          class="nav-btn">
          📈 Análise
        </button>
        <button 
          (click)="currentTab = 'categories'" 
          [class.active]="currentTab === 'categories'"
          class="nav-btn">
          🏷️ Categorias
        </button>
      </nav>

      <main class="app-main">
        <app-transactions-list *ngIf="currentTab === 'transactions'"></app-transactions-list>
        <app-analysis *ngIf="currentTab === 'analysis'"></app-analysis>
        <app-categories *ngIf="currentTab === 'categories'"></app-categories>
      </main>

      <footer class="app-footer">
        <p>&copy; 2024 Gestor Financeiro AF - Desenvolvido com Angular e Node.js</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-content h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
    }

    .header-content p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .app-nav {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex-wrap: wrap;
    }

    .nav-btn {
      padding: 12px 24px;
      border: 2px solid #ddd;
      background: white;
      color: #333;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s;
    }

    .nav-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .nav-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .app-main {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .app-footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: 30px;
    }

    .app-footer p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 20px 10px;
      }

      .header-content h1 {
        font-size: 24px;
      }

      .header-content p {
        font-size: 14px;
      }

      .app-nav {
        padding: 15px;
      }

      .nav-btn {
        padding: 10px 16px;
        font-size: 12px;
      }

      .app-main {
        padding: 15px;
      }
    }
  `]
})
export class App {
  currentTab: string = 'transactions';
}
