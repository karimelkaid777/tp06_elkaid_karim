import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private userService = inject(UserService);
  private router = inject(Router);

  login = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (!this.login() || !this.password()) {
      this.error.set('Login et mot de passe requis');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userService.login(this.login(), this.password()).subscribe({
      next: (user) => {
        this.loading.set(false);
        alert(`Bienvenue ${user.nom} ${user.prenom || ''}!`);
        this.router.navigate(['/pollutions']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Login ou mot de passe incorrect');
        console.error(err);
      }
    });
  }
}
