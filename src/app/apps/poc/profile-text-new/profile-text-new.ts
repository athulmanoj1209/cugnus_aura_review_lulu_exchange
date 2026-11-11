import { UserState } from '@/app/state/user/user.reducer';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-text-new',
  imports: [],
  templateUrl: './profile-text-new.html',
  styleUrl: './profile-text-new.scss',
})
export class ProfileTextNew implements OnInit {
  @Input() user: UserState | undefined;

  ngOnInit(): void {
    console.log('user data initialized in ProfileTextNew:', this.user);
  }
}
