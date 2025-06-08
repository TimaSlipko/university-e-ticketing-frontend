import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `<div class="container py-4"><h2>Admin Dashboard</h2><p>Admin dashboard content coming soon...</p></div>`
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Implementation coming soon
  }
}