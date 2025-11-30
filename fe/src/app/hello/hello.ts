import { Component, OnInit } from '@angular/core';
import { Hello } from '../services/hello.service'; // your existing service
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>{{ message }}</h2>`
})
export class HelloComponent implements OnInit {
  message = '';

  constructor(private helloService: Hello) {}  // inject your service

  ngOnInit(): void {
    this.helloService.getMessage().subscribe(data => {
      this.message = data;
    });
  }
}
