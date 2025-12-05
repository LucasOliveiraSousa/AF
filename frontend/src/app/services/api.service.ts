import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Transaction, Balance, CategorySummary } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }


  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(category: Category): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }


  getAllTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions`);
  }

  getTransactionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions/id/${id}`);
  }

  createTransaction(transaction: Transaction): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions`, transaction);
  }

  updateTransaction(id: string, transaction: Transaction): Observable<any> {
    return this.http.put(`${this.apiUrl}/transactions/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transactions/${id}`);
  }

  getTransactionsByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions/category/${categoryId}`);
  }


  getTotalBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions/balance/total`);
  }

  getSummaryByCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions/summary/category`);
  }


  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl.replace('/api', '')}/health`);
  }
}
