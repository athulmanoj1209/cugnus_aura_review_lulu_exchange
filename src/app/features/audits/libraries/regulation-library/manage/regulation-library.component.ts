import { Component, OnInit, ViewChild, ElementRef, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

// App drawer ref token — adjust path to match your project

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';

// PrimeNG
import { InputTextModule }    from 'primeng/inputtext';
import { TextareaModule }     from 'primeng/textarea';
import { ButtonModule }       from 'primeng/button';
import { SelectModule }       from 'primeng/select';
import { MultiSelectModule }  from 'primeng/multiselect';
import { DatePickerModule }   from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule }      from 'primeng/tooltip';
import { DividerModule }      from 'primeng/divider';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
// Same CLIENT_MODE_VALUE constant the other static seed files (e.g.
// division-static-data.ts) read at module-eval time.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// The internal-audit org-structure seed files (same family as
// client-mode.ts's sibling seeds) — used below to source the Company /
// Division / Sub-Division dropdown *options* from the real DAR Exchange org
// structure when CLIENT_MODE_VALUE is 'internal-audit', instead of from
// company-org-data.ts's multi-company audit-firm ORG_STATIC_DATA. Same
// pattern as regulation-library-list.component.ts.
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';

// Shared Company → Division → Sub-Division static data — the same file every
// other list/drawer in this app now reads from (Recommendations, Working
// Papers, Assign Auditors, Regulation Library list filters, etc.) instead
// of the old per-page hardcoded option lists / CompanyDataService lookups.
// Company/Division/Sub-Division here are matched and stored by NAME (not id),
// since that's how the underlying models represent them everywhere else.
//
// NOTE: the `Regulation` model (models/regulation-library.ts) was not part
// of the files uploaded for this task, so it could not be inspected here.
// This drawer's result object already carries `company`/`division`/
// `subDivision` (as it did before this change, just id-keyed instead of
// name-keyed), and the list component spreads that result straight into
// its `Regulation[]` array, so no shape change is introduced by switching
// the values from ids to names — but if `Regulation` explicitly types
// those fields as literal unions or omits them, that model may need
// `company?: string; division?: string; subDivision?: string;` added.

/**
 * Only when this build's client mode is 'internal-audit' (single-company
 * DAR Exchange seed) do the Company/Division/Sub-Division dropdowns below
 * read their *options* from the real DAR Exchange org structure in the
 * *-indi-org.data.ts seed files, instead of from company-org-data.ts's
 * multi-company ORG_STATIC_DATA (which is what 'audit-firm' mode keeps
 * using, since that taxonomy doesn't apply across arbitrary client
 * companies).
 */
const IS_INTERNAL_AUDIT_CLIENT = CLIENT_MODE_VALUE === 'internal-audit';

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

const ORG_COMPANY_NAMES = COMPANIES_SEED.map(c => c.companyName);

/** All Division names in the DAR org seed, optionally scoped to a company name. */
function orgDivisionNames(companyName: string): string[] {
  const companies = companyName
    ? DIVISION_INDI_ORG_COMPANIES.filter(c => c.companyName === companyName)
    : DIVISION_INDI_ORG_COMPANIES;
  return uniqueSorted(companies.flatMap(c => c.divisions.map(d => d.divisionName)));
}

/** All Sub-Division names in the DAR org seed, optionally scoped to company + division names. */
function orgSubDivisionNames(companyName: string, divisionName: string): string[] {
  const companies = companyName
    ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => c.companyName === companyName)
    : SUB_DIVISION_INDI_ORG_COMPANIES;
  const divisions = companies
    .flatMap(c => c.divisions)
    .filter(d => !divisionName || d.divisionName === divisionName);
  return uniqueSorted(divisions.flatMap(d => d.subDivisions.map((s: { subDivisionName: string }) => s.subDivisionName)));
}

/**
 * False when the given company + division is flagged `hasSubDivision: false`
 * — Sub-Division is then left empty (null) and the dropdown is disabled,
 * same as evidence.component.ts.
 */
function divisionHasSubDivision(companyName: string, divisionName: string): boolean {
  if (!companyName || !divisionName) return true;
  const division = IS_INTERNAL_AUDIT_CLIENT
    ? DIVISION_INDI_ORG_COMPANIES
        .find(c => c.companyName === companyName)?.divisions
        .find(d => d.divisionName === divisionName)
    : ORG_STATIC_DATA
        .find(c => c.companyName === companyName)?.divisions
        .find(d => d.divisionName === divisionName);
  return division?.hasSubDivision !== false;
}


interface SelectOption { label: string; value: string; }
function requireNonEmptyArray(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
const COUNTRY_CODES = [
  'AF','AL','DZ','AD','AO','AG','AR','AM','AU','AT','AZ','BS','BH','BD','BB',
  'BY','BE','BZ','BJ','BT','BO','BA','BW','BR','BN','BG','BF','BI','CV','KH',
  'CM','CA','CF','TD','CL','CN','CO','KM','CG','CD','CR','HR','CU','CY','CZ',
  'DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FJ','FI','FR',
  'GA','GM','GE','DE','GH','GR','GD','GT','GN','GW','GY','HT','HN','HU','IS',
  'IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KI','KP','KR',
  'KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MG','MW','MY','MV',
  'ML','MT','MH','MR','MU','MX','FM','MD','MC','MN','ME','MA','MZ','MM','NA',
  'NR','NP','NL','NZ','NI','NE','NG','MK','NO','OM','PK','PW','PA','PG','PY',
  'PE','PH','PL','PT','QA','RO','RU','RW','KN','LC','VC','WS','SM','ST','SA',
  'SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','SS','ES','LK','SD','SR',
  'SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TO','TT','TN','TR','TM','TV',
  'UG','UA','AE','GB','US','UY','UZ','VU','VE','VN','YE','ZM','ZW'
];
export interface AddRegulationDrawerData {
  existing?: Record<string, any> | null;
  type?: string | null;
}

@Component({
  selector: 'app-regulation-add',
  templateUrl: './regulation-library.component.html',
  styleUrls: ['./regulation-library.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    TooltipModule,
    DividerModule,
    ToastModule,DrawIconComponent
  ],
  providers: [MessageService],
})
export class RegulationAddComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as AddRegulationDrawerData | null;
  readonly isEdit = !!this.data?.existing;
  private readonly messageService = inject(MessageService);
  private readonly toast = inject(ToastService);

  form!: FormGroup;
  submitted  = false;
  selectedFile: File | null = null;
  isDragging  = false;
  tagInputFocused = false;

  // ── Allowed MIME / extensions ─────────────────────────────────────────────────
  readonly acceptedTypes = '.pdf,.doc,.docx,.xls,.xlsx,.txt';
  readonly maxSizeMB     = 10;

  // ── Dropdown options ──────────────────────────────────────────────────────────
  authorityOptions: SelectOption[] = [
    { label: 'CBUAE', value: 'CBUAE' },
    { label: 'DFSA',  value: 'DFSA'  },
    { label: 'ADGM',  value: 'ADGM'  },
    { label: 'SCA',   value: 'SCA'   },
    { label: 'FSRA',  value: 'FSRA'  },
  ];

  typeOptions: SelectOption[] = [
    { label: 'Regulation',      value: 'Regulation'      },
    { label: 'Guidance',        value: 'Guidance'        },
    { label: 'Regulation Book', value: 'Regulation Book' },
    { label: 'Standard',        value: 'Standard'        },
    { label: 'Notice',          value: 'Notice'          },
    { label: 'Circular',        value: 'Circular'        },
  ];

  statusOptions: SelectOption[] = [
    { label: 'Current',    value: 'Current'    },
    { label: 'Draft',      value: 'Draft'      },
    { label: 'Superseded', value: 'Superseded' },
  ];

  /**
   * Sourced from the internal-audit DAR Exchange seed (COMPANIES_SEED) when
   * CLIENT_MODE_VALUE is 'internal-audit', otherwise from company-org-data.ts
   * — the same shared static-data file the Regulation Library list filters,
   * Recommendations, Working Papers, and Assign Auditors all read from —
   * instead of the old CompanyDataService (id-keyed) lookup. Value is the
   * company's display NAME, matching how Division/Sub-Division below (and
   * every other page this session) key off names rather than ids.
   */
  readonly companyOptions = computed<SelectOption[]>(() =>
    IS_INTERNAL_AUDIT_CLIENT
      ? uniqueSorted(ORG_COMPANY_NAMES).map(v => ({ label: v, value: v }))
      : ORG_STATIC_DATA
          .map(c => ({ label: c.companyName, value: c.companyName }))
          .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Division/Sub-Division are no longer static placeholder lists — they
   * cascade off the selected Company/Division and are populated by
   * updateDivisionOptions()/updateSubDivisionOptions() below. They're plain
   * mutable arrays (not computed()/toSignal()) because `form` here is built
   * inside ngOnInit() rather than as a class-field initializer, so the
   * cascading is wired up via .valueChanges.subscribe() once the form
   * exists — matching the pattern used in regulation-library-list.component.ts
   * and auditor-assignment.component.ts.
   */
  divisionOptions: SelectOption[] = [];
  subDivisionOptions: SelectOption[] = [];
  /** False when the selected division is flagged `hasSubDivision: false`. */
  hasSubDivision = true;

  /** In 'internal-audit' mode this reads from the DAR Exchange org seed
   *  (DIVISION_INDI_ORG_COMPANIES) instead of ORG_STATIC_DATA. */
  private updateDivisionOptions(companyName: string): void {
    const names = IS_INTERNAL_AUDIT_CLIENT
      ? orgDivisionNames(companyName)
      : (() => {
          const companies = companyName
            ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
            : ORG_STATIC_DATA;
          return uniqueSorted(companies.flatMap(c => c.divisions).map(b => b.divisionName));
        })();
    this.divisionOptions = names.map(v => ({ label: v, value: v }));
  }

  /** In 'internal-audit' mode this reads from the DAR Exchange org seed
   *  (SUB_DIVISION_INDI_ORG_COMPANIES) instead of ORG_STATIC_DATA. */
  private updateSubDivisionOptions(companyName: string, divisionName: string): void {
    this.hasSubDivision = divisionHasSubDivision(companyName, divisionName);
    if (!this.hasSubDivision) {
      this.subDivisionOptions = [];
      return;
    }
    const names = IS_INTERNAL_AUDIT_CLIENT
      ? orgSubDivisionNames(companyName, divisionName)
      : (() => {
          const companies = companyName
            ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
            : ORG_STATIC_DATA;
          const divisions = companies.flatMap(c => c.divisions)
            .filter(b => !divisionName || b.divisionName === divisionName);
          return uniqueSorted(divisions.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
        })();
    this.subDivisionOptions = names.map(v => ({ label: v, value: v }));
  }


  // countryOptions: SelectOption[] = [
  //   { label: 'UAE (Federal)',           value: 'UAE'   },
  //   { label: 'DIFC (Dubai)',            value: 'DIFC'  },
  //   { label: 'ADGM (Abu Dhabi)',        value: 'ADGM'  },
  //   { label: 'DAFZA (Dubai)',           value: 'DAFZA' },
  //   { label: 'RAKICC (Ras Al Khaimah)', value: 'RAKICC'},
  // ];


countryOptions: SelectOption[] = COUNTRY_CODES
  .map((code) => ({
    value: code,
    label: displayNames.of(code) ?? code,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

  crossRefOptions: SelectOption[] = [
    { label: 'Conduct of Business Rulebook – DFSA-COB',                          value: 'DFSA-COB'        },
    { label: 'Risk-Based Approach Guidance for Virtual Assets – FATF-VA-RBA-2023', value: 'FATF-VA-RBA-2023'},
    { label: 'AML Module – DFSA-AML',                                             value: 'DFSA-AML'        },
    { label: 'Consumer Protection Standards – CBUAE/CP/2021/008',                value: 'CBUAE-CP-2021'   },
    { label: 'Markets Rules – DFSA-MKT',                                          value: 'DFSA-MKT'        },
    { label: 'Digital Assets Framework – ADGM-DAF-2023',                         value: 'ADGM-DAF-2023'   },
    { label: 'Corporate Governance Code – ADGM-CGC-2023',                        value: 'ADGM-CGC-2023'   },
  ];

  scopeOptions: SelectOption[] = [
    { label: 'Banks',                     value: 'banks'             },
    { label: 'Insurance Companies',       value: 'insurance'         },
    { label: 'Investment Firms',          value: 'investment_firms'  },
    { label: 'Exchange Houses',           value: 'exchange_houses'   },
    { label: 'Payment Service Providers', value: 'psp'               },
    { label: 'Finance Companies',         value: 'finance_companies' },
    { label: 'Virtual Asset SPs',         value: 'vasp'              },
    { label: 'Listed Companies',          value: 'listed_companies'  },
    { label: 'Authorized Firms (DIFC)',   value: 'authorized_difc'   },
    { label: 'Registered Firms (ADGM)',   value: 'registered_adgm'   },
  ];

  relatedFunctionOptions: SelectOption[] = [
    { label: 'Onboarding',             value: 'onboarding'      },
    { label: 'Screening',              value: 'screening'       },
    { label: 'Transaction Monitoring', value: 'transaction_mon' },
    { label: 'Compliance',             value: 'compliance'      },
    { label: 'Risk Management',        value: 'risk_management' },
    { label: 'Reporting',              value: 'reporting'       },
    { label: 'Customer Due Diligence', value: 'cdd'             },
    { label: 'Governance',             value: 'governance'      },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({

      country: [null,  Validators.required],
      title:        ['',   [Validators.required, Validators.minLength(5)]],
      description:  ['',    Validators.required],
      effectiveDate:[null,  Validators.required],
      amendedDate:  [null],
      tags:             [[],requireNonEmptyArray],
      relatedFunctions: [[]],
      crossReferences:  [[]],
      scope:        [[], Validators.required],
      company:       [''], division: [''], subDivision: [''],
    });

    // Populate the full Division/Sub-Division lists up-front (no company
    // chosen yet == every division/sub-division across all companies), then
    // narrow via the cascading subscriptions below as Company/Division are
    // picked.
    this.updateDivisionOptions('');
    this.updateSubDivisionOptions('', '');

    // Company change → reset & re-derive Division and Sub-Division.
    this.form.get('company')!.valueChanges.subscribe((companyName: string) => {
      this.form.get('division')!.setValue('', { emitEvent: false });
      this.form.get('subDivision')!.setValue('', { emitEvent: false });
      this.updateDivisionOptions(companyName);
      this.updateSubDivisionOptions(companyName, '');
    });

    // Division change → reset & re-derive Sub-Division.
    this.form.get('division')!.valueChanges.subscribe((divisionName: string) => {
      this.updateSubDivisionOptions(this.form.get('company')!.value, divisionName);
      // Divisions flagged hasSubDivision: false have no Sub-Division — store null.
      this.form.get('subDivision')!.setValue(this.hasSubDivision ? '' : null, { emitEvent: false });
    });

    if (this.data?.existing) {
      const e = this.data.existing;
      // Company → Division → Sub-Division are patched in this order (as
      // they already were in the original code) so the cascading
      // subscriptions above narrow the option lists progressively as each
      // value lands, rather than resetting a later field after its real
      // value was set.
      this.form.patchValue({
        country:          e['country'] ?? null,
        title:            e['title'] ?? '',
        description:      e['description'] ?? '',
        effectiveDate:    e['effectiveDate'] ? new Date(e['effectiveDate']) : null,
        amendedDate:      e['amendedDate'] ? new Date(e['amendedDate']) : null,
        tags:             e['tags'] ?? [],
        relatedFunctions: e['relatedFunctions'] ?? [],
        crossReferences:  e['crossReferences'] ?? [],
        scope:            e['scope'] ?? [],
        company:          e['company'] ?? '',
        division:         e['division'] ?? '',
        subDivision:      e['subDivision'] ?? (this.hasSubDivision ? '' : null),
      });
    }
  }

  // ── File upload ───────────────────────────────────────────────────────────────
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file) this.setFile(file);
    input.value = ''; // reset so same file can be re-selected
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  private setFile(file: File): void {
    if (file.size > this.maxSizeMB * 1024 * 1024) {
      alert(`File exceeds ${this.maxSizeMB} MB limit.`);
      return;
    }
    this.selectedFile = file;
  }

  get fileIconClass(): string {
    const name = this.selectedFile?.name.toLowerCase() ?? '';
    if (name.endsWith('.pdf'))                        return 'pi pi-file-pdf';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'pi pi-file-word';
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'pi pi-file-excel';
    return 'pi pi-file';
  }

  get fileSizeLabel(): string {
    const bytes = this.selectedFile?.size ?? 0;
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  errorMsg(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])  return 'This field is required.';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
    if (ctrl.errors['pattern'])   return 'Use letters, numbers, / - and . (e.g. CBUAE/BSD/2022/001).';
    return 'Invalid value.';
  }

  getLabelFor(options: SelectOption[], value: string): string {
    return options.find(o => o.value === value)?.label ?? value;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const invalidFields = Object.entries(this.form.controls)
        .filter(([, ctrl]) => ctrl.invalid)
        .map(([name, ctrl]) => `${name}: ${JSON.stringify(ctrl.errors)}`);
      console.warn('[RegulationAdd] Blocked — invalid fields:', invalidFields);
      return;
    }
    const result = { ...this.form.value, file: this.selectedFile };
    //this.toast.success(`New regulation has been successfully added.`);
     this.drawerRef.close(result);
    var msg=this.isEdit
        ? ' Regulation details have been successfully updated.'
        : 'New regulation has been successfully added.';

    this.toast.success(msg);

  }

  onCancel(): void {
    this.drawerRef.close(null);
  }

  onReset(): void {
    this.submitted    = false;
    this.selectedFile = null;
    this.form.reset({ tags: [], relatedFunctions: [], crossReferences: [], scope: [] });
    this.updateDivisionOptions('');
    this.updateSubDivisionOptions('', '');
  }
  getError(path: string, field?: string): string | null {
      const ctrl = this.form.get(path);
      if (!ctrl || !ctrl.touched) return null;
      return firstErrorMessage(ctrl.errors, field);
    }
    // ── Tag input ─────────────────────────────────────────────────────────────────
  get tagsValue(): string[] {
    return this.form.get('tags')?.value ?? [];
  }

  addTag(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const value = input.value.trim().replace(/,$/, ''); // strip trailing comma
    if (value && !this.tagsValue.includes(value)) {
      this.form.get('tags')?.setValue([...this.tagsValue, value]);
    }
    input.value = '';
  }

 removeTag(tag: string): void {
  this.form.get('tags')?.setValue(this.tagsValue.filter(t => t !== tag));
  this.form.get('tags')?.markAsTouched();
}
  markTagsTouched(): void {
  this.form.get('tags')?.markAsTouched();
}

}