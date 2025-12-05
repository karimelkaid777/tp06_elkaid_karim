import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Auth } from '../actions/auth.actions';
import { AuthStateModel } from '../models/auth.model';
import { UserService } from '../../users/services/user';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoadFavorites } from '../actions/favorites.actions';

/**
 * État initial de l'authentification
 */
const defaultState: AuthStateModel = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * State NGXS pour l'authentification
 * Gère le login, logout et la persistance
 */
@State<AuthStateModel>({
  name: 'auth',
  defaults: defaultState,
})
@Injectable()
export class AuthState {
  private userService = inject(UserService);

  /**
   * Selector pour récupérer l'état d'authentification
   */
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  /**
   * Selector pour récupérer l'utilisateur courant
   */
  @Selector()
  static currentUser(state: AuthStateModel) {
    return state.user;
  }

  /**
   * Selector pour récupérer le token
   */
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  /**
   * Selector pour récupérer l'état de chargement
   */
  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  /**
   * Selector pour récupérer les erreurs
   */
  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  /**
   * Action de login (asynchrone)
   */
  @Action(Auth.Login)
  login(ctx: StateContext<AuthStateModel>, action: Auth.Login) {
    // Set loading state
    ctx.patchState({
      loading: true,
      error: null,
    });

    return this.userService.login(action.credentials.login, action.credentials.password).pipe(
      tap((response) => {
        // Succès du login
        ctx.dispatch(
          new Auth.LoginSuccess({
            token: response.token,
            user: response,
          })
        );
      }),
      catchError((error) => {
        // Échec du login
        const errorMessage = error?.error?.message || 'Erreur de connexion';
        ctx.dispatch(new Auth.LoginFailure(errorMessage));
        return throwError(() => error);
      })
    );
  }

  /**
   * Action de succès du login
   */
  @Action(Auth.LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: Auth.LoginSuccess) {
    ctx.patchState({
      token: action.payload.token || null,
      user: action.payload.user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    // Charger les favoris de l'utilisateur après le login
    ctx.dispatch(new LoadFavorites());
  }

  /**
   * Action d'échec du login
   */
  @Action(Auth.LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: Auth.LoginFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
      isAuthenticated: false,
    });
  }

  /**
   * Action de logout
   */
  @Action(Auth.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    // Réinitialise l'état à l'état par défaut
    ctx.setState(defaultState);
  }

  /**
   * Action pour nettoyer les erreurs
   */
  @Action(Auth.ClearError)
  clearError(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      error: null,
    });
  }
}
