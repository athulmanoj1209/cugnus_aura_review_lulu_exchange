import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// PrimeNG Modules
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }     from 'primeng/button';
import { SelectModule }   from 'primeng/select';
import { TagModule }        from 'primeng/tag';
import { ChipModule }       from 'primeng/chip';
import { BadgeModule }      from 'primeng/badge';
import { TooltipModule }    from 'primeng/tooltip';
import { InputGroupModule }     from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RegulationLibraryComponent } from './list/regulation-library-list.component';
;

@NgModule({
  declarations: [RegulationLibraryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // PrimeNG
    InputTextModule,
    ButtonModule,
    SelectModule,
    TagModule,
    ChipModule,
    BadgeModule,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  exports: [RegulationLibraryComponent],
})
export class RegulationLibraryModule {}