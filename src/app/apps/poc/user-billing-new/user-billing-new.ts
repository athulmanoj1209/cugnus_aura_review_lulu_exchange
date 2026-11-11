import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BillingTextNew } from '../billing-text-new/billing-text-new';
import { UserState } from '@/app/state/user/user.reducer';
import { updateUserDetails } from '@/app/state/user/user.action';
import { Localstorage, LocalStoragekeys } from '@/app/shared/services/localstorage.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

@Component({
  selector: 'app-user-billing-new',
  imports: [BillingTextNew, DrawIconComponent],
  templateUrl: './user-billing-new.html',
  styleUrl: './user-billing-new.scss',
})
export class UserBillingNew implements OnInit {
  @Input() user!: UserState;
  billingRole: string | undefined = "billing of the finance user";

  private localStorage = inject(Localstorage);
  private store: Store = inject(Store);

  async ngOnInit(): Promise<void> {
    if (this.user?.id) {
      const userData = await this.localStorage.getItem(LocalStoragekeys.UserData);
      // this.localStorage.setItem(LocalStoragekeys.UserData, { ...userData, billingRole: this.billingRole });

      this.store.dispatch(updateUserDetails({ billingRole: this.billingRole, prefferedLanguage: userData?.prefferedLanguage }));
    }
  }
}
