import { Component, inject, signal, OnInit } from '@angular/core';
import { Productos as ProductoServicio } from '../../services/productos';
import { Producto } from '../../models/producto.model';

@Component({
  imports: [],
  selector: 'app-productos',
  styleUrl: './productos.css',
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  errorCargando = signal<boolean>(false);

  private servicio = inject(
    ProductoServicio
  );

  ngOnInit(): void {
    this.servicio.obtenerProductos().subscribe({
      next: (dato) => {
        this.productos.set(dato.slice(0, 8));
        console.log(dato.slice(0, 8));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al obtener los productos:', error);
        this.errorCargando.set(true);
        this.cargando.set(false);
      }
    });
  }
}