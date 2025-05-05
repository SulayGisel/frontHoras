import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { MaestroTurnoComponent } from './maestro-turno/maestro-turno.component';
import { RegistroTurnoComponent } from './registro-turno/registro-turno.component';
import { RegistroHorasComponent } from './registro-horas/registro-horas.component';
import { authGuard } from './core/guards/auth.guard';
import { MaestroHoraLegalComponent } from './maestro-hora-legal/maestro-hora-legal.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent ,   canActivate: [authGuard]},
    { path: 'listarUsuario', component: ListarUsuariosComponent ,canActivate: [authGuard]},
    { path: 'recovery', component: RecuperarPasswordComponent ,canActivate: [authGuard]},
    { path: 'maestroTurno', component: MaestroTurnoComponent ,canActivate: [authGuard]},
    { path: 'RegistroTurno', component: RegistroTurnoComponent , canActivate: [authGuard]},
    { path: 'registrohora', component: RegistroHorasComponent ,canActivate: [authGuard]},
    { path: 'maestroHoraLegal', component: MaestroHoraLegalComponent ,canActivate: [authGuard]}


];
