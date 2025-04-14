import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent implements OnInit {
  collapseShow = 'hidden';
  activeLink: string = '';
  userEmail: unknown = 'email';
  rolName: unknown = 'admin';

  menuItems: any[] = [];

  constructor(private router: Router, private authServices: AuthService) {}

  setActiveLink(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', link);
  }

  isMenuOpen = false;
  isScrolled = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubMenu(item: any): void {
    if (item.subItems) {
      item.isOpen = !item.isOpen;
    } else {
      this.setActiveLink(item.name);
      this.router.navigate([item.link]);
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('activeLink');
    this.router.navigate(['/Auth/login']);
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const infoUser = this.authServices.getUserInfo();
      this.userEmail = infoUser.email;
      this.rolName = infoUser.rol;

      // Configurar menú según rol
      this.configureMenuBasedOnRole(infoUser.rol || 'default');

      const statuSidebar = localStorage.getItem('activeLink');
      this.activeLink = statuSidebar || 'home';
      localStorage.setItem('activeLink', this.activeLink);
    }
  }

  private configureMenuBasedOnRole(rol: string): void {
    const commonItems = [
      {
        name: 'Home',
        icon: 'fa-solid fa-house',
        link: '/Usuario/welcome',
      },
    ];

    switch (rol?.toLowerCase()) {
      case 'administrador':
        this.menuItems = [
          ...commonItems,
          {
            name: 'Gestión de Usuarios',
            icon: 'fa-solid fa-users-cog',
            link: '/Admin/gestionar-usuario',
          },
        ];
        break;

      case 'gestor':
        this.menuItems = [
          ...commonItems,
          {
            name: 'Gestion de Turnos',
            icon: 'fa-solid fa-chart-bar',
            link: '/Gestor/gestionar-turno',
          },
        ];
        break;

      case 'cajero':
        this.menuItems = [
          ...commonItems,
          {
            name: 'Gestion de Clientes',
            icon: 'fa-solid fa-cog',
            link: '/Client/gestionar-client',
          },
        ];
        break;

      default:
        this.menuItems = commonItems;
    }
  }
}
