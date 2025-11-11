import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { CreateUserDto } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private userService = inject(UserService);
  private router = inject(Router);

  nom = signal('');
  prenom = signal('');
  login = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  onSubmit() {
    // Validation des champs requis
    if (!this.nom() || !this.prenom() || !this.login() || !this.email() || !this.password() || !this.confirmPassword()) {
      this.error.set('Tous les champs sont obligatoires');
      return;
    }

    // Validation de l'email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email())) {
      this.error.set('Format d\'email invalide');
      return;
    }

    // Validation de la correspondance des mots de passe
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const userDto: CreateUserDto = {
      nom: this.nom(),
      prenom: this.prenom(),
      login: this.login(),
      email: this.email(),
      pass: this.password()
    };

    this.userService.createUser(userDto).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.success.set(true);
        alert(`Compte créé avec succès pour ${user.nom}!`);
        setTimeout(() => {
          this.router.navigate(['/users/login']);
        }, 1000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la création du compte');
        console.error(err);
      }
    });
  }
}
