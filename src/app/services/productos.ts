
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, ProductoInput } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class Productos {

  private readonly url = 'https://fakestoreapi.com/products';
  private readonly http = inject(HttpClient);

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  // Crear producto
  crearProducto(producto: ProductoInput) {
    return this.http.post<Producto>(this.url, producto);
  }

  // Actualizar producto
  actualizarProducto(id: number, producto: ProductoInput) {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  // Eliminar producto
  eliminarProducto(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Obtener categorias
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/categories`);
  }
}
