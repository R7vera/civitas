import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/inicioSesion/token.service';

export const unifiedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const tokenUsuario = inject(TokenService);
  const router = inject(Router);

  const token = tokenUsuario.getToken();
  const usuario = tokenUsuario.getUsuario();

    // Verificar si está accediendo a rutas públicas (login, registrar)
    if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'registrar') {
      // Si el usuario está autenticado y es cliente, redirigir al principalCliente
      if (token && usuario?.tipoUsuario === 'Cliente') {
        router.navigateByUrl('/principalcliente', { replaceUrl: true });
        return false;
      }
      // Si el usuario está autenticado y es administrador, redirigir al dashboard-admi
      if (token && usuario?.tipoUsuario === 'Administrador') {
        router.navigateByUrl('/dashboard-admi', { replaceUrl: true });
        return false;
      }
      return true;  // Permitir acceso al login y registrar si no está autenticado
    } 
    
    // Verificar acceso a rutas de clientes
    if (route.routeConfig?.path === 'principalcliente') {
      // Solo clientes pueden acceder a 'principalcliente'
      if (token && usuario?.tipoUsuario === 'Cliente') {
        return true;
      }
      router.navigateByUrl('/login', { replaceUrl: true });  // Redirigir al login si no es cliente o no está autenticado
      return false;
    }
  
    // Verificar acceso a rutas de administración
    if (route.routeConfig?.path === 'dashboard-admi') {
      // Solo administradores pueden acceder a 'dashboard-admi'
      if (token && usuario?.tipoUsuario === 'Administrador') {
        return true;
      }
      router.navigateByUrl('/login', { replaceUrl: true });  // Redirigir al login si no es administrador o no está autenticado
      return false;
    }
  
    if (route.routeConfig?.path === 'paises' || route.routeConfig?.path === 'departamentos' || 
        route.routeConfig?.path === 'ciudades' || route.routeConfig?.path === 'distritos' || 
        route.routeConfig?.path === 'destinos' || route.routeConfig?.path === 'choferes') {
      // Solo administradores pueden acceder a rutas de administración (paises, departamentos, ciudades, distritos, destinos)
      if (token && usuario?.tipoUsuario === 'Administrador') {
        return true;
      }
      router.navigateByUrl('/login', { replaceUrl: true });  // Redirigir al login si no es administrador o no está autenticado
      return false;
    }
  
    return true;   // Permitir el acceso en otros casos no especificados
};
 