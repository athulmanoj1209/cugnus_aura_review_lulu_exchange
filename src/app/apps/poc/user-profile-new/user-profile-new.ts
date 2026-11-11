import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileTextNew } from '../profile-text-new/profile-text-new';
import { UserState } from '@/app/state/user/user.reducer';
import { updateUserDetails } from '@/app/state/user/user.action';
import { SelectModule } from 'primeng/select';
import { Localstorage, LocalStoragekeys } from '@/app/shared/services/localstorage.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

@Component({
  selector: 'app-user-profile-new',
  imports: [ProfileTextNew, SelectModule, DrawIconComponent],
  templateUrl: './user-profile-new.html',
  styleUrl: './user-profile-new.scss',
})

export class UserProfileNew implements OnInit, OnChanges {
  @Input() user!: UserState;
  @Output() profileRoleChangedUserData = new EventEmitter<UserState>();

  profileRole: string | undefined = "profile of the finance user";

  private store: Store = inject(Store);
  private localStorage = inject(Localstorage);

  async ngOnInit(): Promise<void> {
    if (this.user?.id) {
      const userData = await this.localStorage.getItem(LocalStoragekeys.UserData);
      // this.localStorage.setItem(LocalStoragekeys.UserData, { ...userData, profileRole: this.profileRole });

      this.profileRoleChangedUserData.emit({ ...this.user, profileRole: this.profileRole });
      this.store.dispatch(updateUserDetails({ profileRole: this.profileRole, prefferedLanguage: userData?.prefferedLanguage }));

    }
  }

  ngOnChanges(): void {
    console.log('profile child rerenders when input change');
  }

}
