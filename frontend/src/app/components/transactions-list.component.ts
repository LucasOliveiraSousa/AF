import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Transaction, Category } from '../models';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transactions-container">
      <h2>Movimentações Financeiras</h2>
      
      <div class="actions">
        <button (click)="openAddForm()" class="btn btn-primary">+ Nova Movimentação</button>
        <select [(ngModel)]="selectedCategory" (change)="filterByCategory()" class="filter-select">
          <option value="">Todas as Categorias</option>
          <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
        </select>
      </div>

      <div *ngIf="showForm" class="form-container">
        <h3>{{ editingId ? 'Editar' : 'Nova' }} Movimentação</h3>
        <form (ngSubmit)="saveTransaction()">
          <div class="form-group">
            <label>Descrição</label>
            <input [(ngModel)]="formData.description" name="description" required>
          </div>
          <div class="form-group">
            <label>Valor</label>
            <input type="number" [(ngModel)]="formData.amount" name="amount" step="0.01" required>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select [(ngModel)]="formData.type" name="type" required>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select [(ngModel)]="formData.category" name="category" required>
              <option value="">Selecione uma categoria</option>
              <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Data</label>
            <input type="date" [(ngModel)]="formData.date" name="date" required>
          </div>
          <div class="form-group">
            <label>Notas</label>
            <textarea [(ngModel)]="formData.notes" name="notes"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" (click)="cancelForm()" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of filteredTransactions" [ngClass]="transaction.type">
              <td>{{ transaction.date | date: 'dd/MM/yyyy' }}</td>
              <td>{{ transaction.description }}</td>
              <td>
                <span class="category-badge" [style.backgroundColor]="getCategoryColor(transaction.category)">
                  {{ getCategoryName(transaction.category) }}
                </span>
              </td>
              <td>
                <span [ngClass]="transaction.type === 'income' ? 'badge-income' : 'badge-expense'">
                  {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
                </span>
              </td>
              <td [ngClass]="transaction.type === 'income' ? 'amount-income' : 'amount-expense'">
                {{ transaction.type === 'income' ? '+' : '-' }} R$ {{ transaction.amount.toFixed(2) }}
              </td>
              <td>
                <button (click)="editTransaction(transaction)" class="btn btn-sm btn-edit">Editar</button>
                <button (click)="deleteTransaction(transaction._id!)" class="btn btn-sm btn-delete">Deletar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }

    .btn-primary:hover {
      background-color: #45a049;
    }

    .btn-success {
      background-color: #4CAF50;
      color: white;
    }

    .btn-secondary {
      background-color: #999;
      color: white;
    }

    .btn-edit {
      background-color: #2196F3;
      color: white;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
    }

    .btn-sm {
      padding: 5px 10px;
      font-size: 12px;
    }

    .filter-select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .transactions-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: #f0f0f0;
      padding: 15px;
      text-align: left;
      font-weight: bold;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    td {
      padding: 12px 15px;
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

    .badge-income {
      background-color: #4CAF50;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .badge-expense {
      background-color: #f44336;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .amount-income {
      color: #4CAF50;
      font-weight: bold;
    }

    .amount-expense {
      color: #f44336;
      font-weight: bold;
    }
  `]
})
export class TransactionsListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  showForm: boolean = false;
  editingId: string | null = null;

  formData: Partial<Transaction> = {
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
      },
      error: (error) => console.error('Erro ao carregar categorias:', error)
    });
  }

  loadTransactions(): void {
    this.apiService.getAllTransactions().subscribe({
      next: (response: any) => {
        this.transactions = response.data || [];
        this.filteredTransactions = this.transactions;
      },
      error: (error) => console.error('Erro ao carregar transações:', error)
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredTransactions = this.transactions.filter(
        t => (typeof t.category === 'object' ? t.category._id : t.category) === this.selectedCategory
      );
    } else {
      this.filteredTransactions = this.transactions;
    }
  }

  openAddForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.formData = {
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }

  editTransaction(transaction: Transaction): void {
    this.editingId = transaction._id || null;
    this.formData = { ...transaction };
    this.showForm = true;
  }

  saveTransaction(): void {
    if (this.editingId) {
      this.apiService.updateTransaction(this.editingId, this.formData as Transaction).subscribe({
        next: () => {
          this.loadTransactions();
          this.cancelForm();
        },
        error: (error) => console.error('Erro ao atualizar transação:', error)
      });
    } else {
      this.apiService.createTransaction(this.formData as Transaction).subscribe({
        next: () => {
          this.loadTransactions();
          this.cancelForm();
        },
        error: (error) => console.error('Erro ao criar transação:', error)
      });
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      this.apiService.deleteTransaction(id).subscribe({
        next: () => this.loadTransactions(),
        error: (error) => console.error('Erro ao deletar transação:', error)
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  getCategoryName(category: any): string {
    return typeof category === 'object' ? category.name : '';
  }

  getCategoryColor(category: any): string {
    return typeof category === 'object' ? category.color : '#999';
  }
}
