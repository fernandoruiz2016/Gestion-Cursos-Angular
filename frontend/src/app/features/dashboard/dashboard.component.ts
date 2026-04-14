import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { UserRole } from '../../core/models/user.model';
import { LucideAngularModule, LayoutDashboard, Users, BookOpen, LogOut, UserPlus } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, HasRoleDirective, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly LayoutIcon = LayoutDashboard;
  readonly UsersIcon = Users;
  readonly BookIcon = BookOpen;
  readonly EnrollIcon = UserPlus;
  readonly LogoutIcon = LogOut;

  private authService = inject(AuthService);
  user = this.authService.getUser();
  roles = UserRole;

  logout() {
    this.authService.logout();
  }
}
