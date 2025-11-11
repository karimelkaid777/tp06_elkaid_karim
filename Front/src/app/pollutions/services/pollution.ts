import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {Pollution} from '../models/pollution.model';
import {CreatePollutionDto, UpdatePollutionDto, PollutionFilterDto} from '../models/pollution.dto';

// Interface pour les données du backend (snake_case)
interface PollutionBackend {
  id: number;
  titre: string;
  type_pollution: string;
  description: string;
  date_observation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PollutionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pollution`;

  // Convertir du format backend vers frontend
  private mapFromBackend(data: PollutionBackend): Pollution {
    return {
      id: data.id,
      title: data.titre,
      type: data.type_pollution as any,
      description: data.description,
      dateObservation: new Date(data.date_observation),
      location: data.lieu,
      latitude: data.latitude,
      longitude: data.longitude,
      photoUrl: data.photo_url
    };
  }

  // Convertir du format frontend vers backend pour CREATE
  private mapToBackendCreate(dto: CreatePollutionDto): any {
    return {
      titre: dto.title,
      type_pollution: dto.type,
      description: dto.description,
      date_observation: dto.dateObservation,
      lieu: dto.location,
      latitude: dto.latitude,
      longitude: dto.longitude,
      photo_url: dto.photoUrl
    };
  }

  // Convertir du format frontend vers backend pour UPDATE
  private mapToBackendUpdate(dto: UpdatePollutionDto): any {
    const mapped: any = {};
    if (dto.title !== undefined) mapped.titre = dto.title;
    if (dto.type !== undefined) mapped.type_pollution = dto.type;
    if (dto.description !== undefined) mapped.description = dto.description;
    if (dto.dateObservation !== undefined) mapped.date_observation = dto.dateObservation;
    if (dto.location !== undefined) mapped.lieu = dto.location;
    if (dto.latitude !== undefined) mapped.latitude = dto.latitude;
    if (dto.longitude !== undefined) mapped.longitude = dto.longitude;
    if (dto.photoUrl !== undefined) mapped.photo_url = dto.photoUrl;
    return mapped;
  }

  getAllPollutions(): Observable<Pollution[]> {
    return this.http.get<PollutionBackend[]>(this.apiUrl).pipe(
      map(data => data.map(item => this.mapFromBackend(item)))
    );
  }

  getPollutionById(id: number): Observable<Pollution> {
    return this.http.get<PollutionBackend>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.mapFromBackend(data))
    );
  }

  createPollution(pollutionDto: CreatePollutionDto): Observable<Pollution> {
    const backendDto = this.mapToBackendCreate(pollutionDto);
    return this.http.post<PollutionBackend>(this.apiUrl, backendDto).pipe(
      map(data => this.mapFromBackend(data))
    );
  }

  updatePollution(id: number, pollutionDto: UpdatePollutionDto): Observable<Pollution> {
    const backendDto = this.mapToBackendUpdate(pollutionDto);
    return this.http.put<PollutionBackend>(`${this.apiUrl}/${id}`, backendDto).pipe(
      map(data => this.mapFromBackend(data))
    );
  }

  deletePollution(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filterPollutions(filters: PollutionFilterDto): Observable<Pollution[]> {
    let url = this.apiUrl;
    const params = new URLSearchParams();

    if (filters.type) params.append('type_pollution', filters.type);
    if (filters.title) params.append('titre', filters.title);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return this.http.get<PollutionBackend[]>(url).pipe(
      map(data => data.map(item => this.mapFromBackend(item)))
    );
  }
}
