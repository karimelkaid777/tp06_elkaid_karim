export interface User {
  id: string;
  nom: string;
  prenom: string;
  login: string;
  email: string;
  pass?: string;
}

export interface CreateUserDto {
  nom: string;
  prenom: string;
  login: string;
  email: string;
  pass: string;
}
