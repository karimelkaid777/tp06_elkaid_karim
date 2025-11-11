import {Component, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Pollution} from '../../models/pollution.model';
import {PollutionService} from '../../services/pollution';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';

@Component({
  selector: 'app-pollution-detail',
  imports: [RouterLink],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.scss'
})
export class PollutionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pollutionService = inject(PollutionService);

  pollution = signal<Pollution | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPollution(id);
  }

  loadPollution(id: number) {
    this.loading.set(true);
    this.pollutionService.getPollutionById(id).subscribe({
      next: (data) => {
        this.pollution.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Pollution non trouvée');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onBack() {
    this.router.navigate(['/pollutions/list']);
  }

  onEdit() {
    const pollution = this.pollution();
    if (pollution) {
      this.router.navigate(['/pollutions/edit', pollution.id]);
    }
  }

  onDelete() {
    const pollution = this.pollution();
    if (pollution && confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.pollutionService.deletePollution(pollution.id).subscribe({
        next: () => {
          this.router.navigate(['/pollutions/list']);
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  getTypeLabel(type: string): string {
    return type;
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'EEEE d MMMM yyyy', { locale: fr });
  }
}
