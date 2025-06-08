import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-Ticketing System';
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Hide navbar on auth pages
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.showNavbar = !(event as NavigationEnd).url.startsWith('/auth');
      });
  }
}