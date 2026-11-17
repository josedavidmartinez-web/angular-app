import { Component, inject, signal } from '@angular/core';
import { Productos } from '../services/productos';
import { Producto, ProductoInput } from '../models/producto.model';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [FormsModule],
  selector: 'app-panel',
  styleUrl: './panel.css',
  templateUrl: './panel.html',
})
export class Panel {

  productos = signal<Producto[]>([])
  categories = signal<string[]>([]) // guardar categorias 
  service = inject(Productos)
  editingId = signal<number | null>(null)

  ngOnInit(): void {
    this.cargarProductos()
    this.service.getCategories().subscribe((data) => this.categories.set(data));
  }
  
  cargarProductos() {
    this.service.obtenerProductos().subscribe({
      next: (data)=> {
        this.productos.set(data)
      }
    }
  )
  }
  // Datos del formulario, enlazados con ngModel
  form: ProductoInput = { title: '', price: 0, description: '', category: '', image: '' };
  save(): void {
    


    if (!this.form.title || !this.form.category || !this.form.image ||
       this.form.price <= 0) {
      return;
    }


    const id = this.editingId();
    if (id === null) {
      this.create();
    } else {
      this.update(id);
    }
  }
  // CREATE: agregar un producto
  private create(): void {
    this.service.crearProducto(this.form).subscribe({
      next: (product) => {
        this.productos.update((list) => [product, ...list]);
       
        this.cancel();
      },
     
    });
  }


  // UPDATE: guardar los cambios de un producto
  private update(id: number): void {
    this.service.actualizarProducto(id, this.form).subscribe({
      next: (product) => {
        this.productos.update((list) =>
          list.map((item) => (item.id === id ? { ...item, ...product } : item))
        );
       
        this.cancel();
      },
      
    });
  }
  // Llena el formulario con el producto que se va a editar
  edit(product: Producto): void {
    this.editingId.set(product.id);
    this.form = { ...product };
  }


  // Limpia el formulario y sale del modo edición
  cancel(): void {
    this.editingId.set(null);
    this.form = { title: '', price: 0, description: '', category: '', image: '' };
  }
}
