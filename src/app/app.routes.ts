import { Routes } from '@angular/router';
import { RegistrarComponent } from './components/auth/registrar/registrar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { unifiedGuard } from './guards/auth.guard';
import { AsientosComponent } from './components/administrador/asientos/asientos.component';
import { VehiculoComponent } from './components/administrador/vehiculo/vehiculo.component';
import { ChoferComponent } from './components/administrador/chofer/chofer.component';
import { DistritoComponent } from './components/administrador/distrito/distrito.component';
import { DepartamentosComponent } from './components/administrador/departamentos/departamentos.component';
import { PaisesComponent } from './components/administrador/paises/paises.component';
import { PrincipalAdministradorComponent } from './components/administrador/principal-administrador/principal-administrador.component';
import { PrincipalClienteComponent } from './components/cliente/principal-cliente/principal-cliente.component';
import { CiudadesComponent } from './components/administrador/ciudades/ciudades.component';
import { DestinosComponent } from './components/administrador/destinos/destinos.component';
import { ProgramacionComponent } from './components/administrador/programacion/programacion.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [unifiedGuard] },
    { path: 'paises', component: PaisesComponent, canActivate: [unifiedGuard]},
    { path: 'departamentos', component: DepartamentosComponent, canActivate: [unifiedGuard]},
    { path: "registrar", component: RegistrarComponent , canActivate: [unifiedGuard]},
    { path: "principalcliente", component: PrincipalClienteComponent, canActivate: [unifiedGuard]},
    { path: "dashboard-admi", component: PrincipalAdministradorComponent, canActivate: [unifiedGuard]},
    { path: "ciudades", component: CiudadesComponent, canActivate: [unifiedGuard]},
    { path: "distritos", component: DistritoComponent, canActivate: [unifiedGuard]},
    { path: "destinos", component: DestinosComponent, canActivate: [unifiedGuard]},
    { path: "choferes", component: ChoferComponent, canActivate: [unifiedGuard] },
    { path: 'asientos', component: AsientosComponent, canActivate: [unifiedGuard]},
    { path: 'vehiculos', component: VehiculoComponent, canActivate: [unifiedGuard]},
    { path: "programacion", component: ProgramacionComponent, canActivate: [unifiedGuard]},
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
