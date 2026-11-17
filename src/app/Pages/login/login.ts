import { Component, inject, signal } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  private servicio = inject(Auth);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  readonly formulario = new FormGroup({
    usuario: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4)
      ]
    })
  });

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.touched && control.invalid;
  }

  envio(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { password, usuario } = this.formulario.getRawValue();

    this.loading.set(true);
    this.error.set(null);

    this.servicio.login(usuario, password).subscribe({
      next: () => {
        this.loading.set(false);
        console.log('Inicio de sesión correcto');
      },
      error: (error) => {
        this.loading.set(false);

        this.error.set(
          error.status === 401
            ? 'Usuario o contraseña incorrectos'
            : 'No se puede conectar. Intenta más tarde.'
        );
      }
    });
  }
}