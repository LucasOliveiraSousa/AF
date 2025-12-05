import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Category } from '../models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-container">
      <h2>Gerenciar Categorias</h2>
      
      <button (click)="openAddForm()" class="btn btn-primary">+ Nova Categoria</button>

      <div *ngIf="showForm" class="form-container">
        <h3>{{ editingId ? 'Editar' : 'Nova' }} Categoria</h3>
        <form (ngSubmit)="saveCategory()">
          <div class="form-group">
            <label>Nome</label>
            <input [(ngModel)]="formData.name" name="name" required>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select [(ngModel)]="formData.type" name="type" required>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Cor</label>
            <div class="color-picker">
              <input type="color" [(ngModel)]="formData.color" name="color" required>
              <span class="color-preview" [style.backgroundColor]="formData.color"></span>
            </div>
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea [(ngModel)]="formData.description" name="description"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" (click)="cancelForm()" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="categories-grid">
        <div *ngFor="let category of categories" class="category-card" [style.borderLeftColor]="category.color">
          <div class="category-header">
            <h4>{{ category.name }}</h4>
            <span class="category-type" [ngClass]="category.type === 'income' ? 'type-income' : 'type-expense'">
              {{ category.type === 'income' ? 'Receita' : 'Despesa' }}
            </span>
          </div>
          <p *ngIf="category.description" class="category-description">{{ category.description }}</p>
          <div class="color-indicator" [style.backgroundColor]="category.color"></div>
          <div class="category-actions">
            <button (click)="editCategory(category)" class="btn btn-sm btn-edit">Editar</button>
            <button (click)="deleteCategory(category._id!)" class="btn btn-sm btn-delete">Deletar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    h2 {
      color: #333;
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
      margin-bottom: 20px;
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

    .color-picker {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .color-picker input[type="color"] {
      width: 50px;
      height: 40px;
      padding: 2px;
      cursor: pointer;
    }

    .color-preview {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .category-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .category-header h4 {
      margin: 0;
      color: #333;
    }

    .category-type {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }

    .type-income {
      background-color: #4CAF50;
      color: white;
    }

    .type-expense {
      background-color: #f44336;
      color: white;
    }

    .category-description {
      color: #666;
      font-size: 14px;
      margin: 10px 0;
    }

    .color-indicator {
      width: 100%;
      height: 30px;
      border-radius: 4px;
      margin: 15px 0;
    }

    .category-actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  showForm: boolean = false;
  editingId: string | null = null;

  formData: Partial<Category> = {
    name: '',
    type: 'expense',
    color: '#FF6B6B',
    description: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
      },
      error: (error) => console.error('Erro ao carregar categorias:', error)
    });
  }

  openAddForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.formData = {
      name: '',
      type: 'expense',
      color: '#FF6B6B',
      description: ''
    };
  }

  editCategory(category: Category): void {
    this.editingId = category._id || null;
    this.formData = { ...category };
    this.showForm = true;
  }

  saveCategory(): void {
    if (this.editingId) {
      this.apiService.updateCategory(this.editingId, this.formData as Category).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelForm();
        },
        error: (error) => console.error('Erro ao atualizar categoria:', error)
      });
    } else {
      this.apiService.createCategory(this.formData as Category).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelForm();
        },
        error: (error) => console.error('Erro ao criar categoria:', error)
      });
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Erro ao deletar categoria:', error)
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }
}
