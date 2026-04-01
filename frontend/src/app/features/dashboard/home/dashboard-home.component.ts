import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../../../core/services/course.service';
import { LucideAngularModule, Users, BookOpen, Shield } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  readonly UsersIcon = Users;
  readonly BookIcon = BookOpen;
  readonly ShieldIcon = Shield;
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  user = this.authService.getUser();
  userCount = 0;
  courseCount = 0;
  loading = true;

  ngOnInit() {
    this.loading = true;
    forkJoin({
      users: this.userService.getAll(),
      courses: this.courseService.getAll()
    }).subscribe({
      next: (data) => {
        this.userCount = data.users.length;
        this.courseCount = data.courses.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
