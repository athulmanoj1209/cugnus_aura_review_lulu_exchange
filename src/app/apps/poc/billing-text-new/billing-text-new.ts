import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '@/app/state/user/user.reducer';
import { updateUserDetails } from '@/app/state/user/user.action';

@Component({
  selector: 'app-billing-text-new',
  imports: [],
  templateUrl: './billing-text-new.html',
  styleUrl: './billing-text-new.scss',
})
export class BillingTextNew implements OnInit {
  @Input() user: UserState | undefined;

  ngOnInit(): void {
    console.log('user data initialized in ProfileTextNew:', this.user);
  }
}
