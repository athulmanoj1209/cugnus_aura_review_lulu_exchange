import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import {
  AuditEvent,
  EventType,
  LinkedEntity,
  LocationType,
  MOCK_LINKED_ENTITIES,
  MOCK_PARTICIPANTS,
  Participant,
} from '../models/events-meeting.model';
import {
  EventLinkedEntityTypes,
  EVENT_DEFAULT_ORGANIZER,
  EVENT_FIELD_LIMITS,
  EVENT_MAX_FILE_SIZE_BYTES,
  EVENT_SCOPE_OPTION_ID_PREFIX,
  EVENT_SUBMIT_DELAY_MS,
} from '../constants/events-meetings.constants';
import {
  EVENT_LOCATION_TYPE_OPTIONS,
  EVENT_TIME_OPTIONS,
  EVENT_TYPE_OPTIONS,
} from '../constants/events-meetings-labels.constants';
import {
  EVENT_DRAWER_SUBTITLES,
  EVENT_DRAWER_TITLES,
  EVENT_LOCATION_PLACEHOLDERS,
  EVENT_SUBMIT_LABELS,
  EVENT_TOAST_MESSAGES,
} from '../constants/events-meetings-messages.constants';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';


/**
 * Every distinct audit scope name defined across the shared
 * company-org-data.ts directory (Company -> Branch -> Department ->
 * Scopes), turned into LinkedEntity options for the "Scope" dropdown
 * below — instead of the two hardcoded 'Scope' entries that used to live
 * in MOCK_LINKED_ENTITIES. Task/RFI/Finding options are unaffected since
 * that data doesn't exist in the common org file.
 */
function buildScopeOptions(): LinkedEntity[] {
  const names = new Set<string>();
  ORG_STATIC_DATA.forEach(company =>
    company.divisions.forEach(branch =>
      branch.subDivisions.forEach(dept =>
        dept.scopes.forEach(scope => names.add(scope.scopeName)),
      ),
    ),
  );
  return Array.from(names)
    .sort((a, b) => a.localeCompare(b))
    .map(name => ({
      id: `${EVENT_SCOPE_OPTION_ID_PREFIX}${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
      label: `${name}`,
      type: EventLinkedEntityTypes.Scope,
    }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Combine a Date (date part) and a Date (time part) into one Date */
function combineDateAndTime(date: Date | null, time: Date | null): Date | null {
  if (!date) return null;
  const d = new Date(date);
  if (time) {
    d.setHours(time.getHours(), time.getMinutes(), 0, 0);
  }
  return d;
}

// ── Custom Validators ─────────────────────────────────────────────────────────

function endAfterStartValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const sd = group.get('startDate')?.value;
    const st = group.get('startTime')?.value;
    const ed = group.get('endDate')?.value;
    const et = group.get('endTime')?.value;
    if (!sd || !ed) return null;

    const start = combineDateAndTime(sd, st ? parseTime(st) : null);
    const end   = combineDateAndTime(ed, et ? parseTime(et) : null);
    return start && end && end <= start ? { endBeforeStart: true } : null;
  };
}

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function virtualLinkValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const type = group.get('locationType')?.value;
    const link = group.get('locationDetail')?.value;
    return type === LocationType.Virtual && !link?.trim()
      ? { virtualLinkRequired: true }
      : null;
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-em-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    TagModule,
    ToastModule,
    TooltipModule,DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './events-meetings.component.html',
  styleUrls: ['./events-meetings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmFormComponent implements OnInit, OnDestroy {

  // ── Drawer wiring ─────────────────────────────────────────────────────────
  private readonly drawerRef  = inject(DrawerRef) as DrawerRef<AuditEvent>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AuditEvent | null;

  // ── Services ──────────────────────────────────────────────────────────────
  private readonly fb             = inject(FormBuilder);
  private readonly cdr            = inject(ChangeDetectorRef);
   private readonly toast = inject(ToastService);

  // ── State ─────────────────────────────────────────────────────────────────
  form!: FormGroup;
  readonly isEditMode = computed(() => !!this.drawerData?.id);
  submitting    = signal(false);
  uploadedFiles: File[] = [];
  isDragOver = false;

  // ── Options ───────────────────────────────────────────────────────────────
  readonly eventTypeOptions    = EVENT_TYPE_OPTIONS;
  readonly locationTypeOptions = EVENT_LOCATION_TYPE_OPTIONS;
  readonly participantOptions  = MOCK_PARTICIPANTS;
  readonly timeOptions         = EVENT_TIME_OPTIONS;
  readonly LocationType        = LocationType;

  /** Scope options come from the shared org data directory; Task/RFI/Finding still come from MOCK_LINKED_ENTITIES. */
  readonly scopeOptions    = buildScopeOptions();
  readonly taskOptions     = MOCK_LINKED_ENTITIES.filter(e => e.type === EventLinkedEntityTypes.Task);
  readonly rfiOptions      = MOCK_LINKED_ENTITIES.filter(e => e.type === EventLinkedEntityTypes.RFI);
  readonly findingOptions  = MOCK_LINKED_ENTITIES.filter(e => e.type === EventLinkedEntityTypes.Finding);

  /** Organizer picks from the same participant directory as the Participants field. */
  readonly organizerOptions = MOCK_PARTICIPANTS;

  readonly currentUser: Participant = EVENT_DEFAULT_ORGANIZER;

  // Exposed for the template.
  readonly fieldLimits         = EVENT_FIELD_LIMITS;
  readonly drawerTitles        = EVENT_DRAWER_TITLES;
  readonly drawerSubtitles     = EVENT_DRAWER_SUBTITLES;
  readonly submitLabels        = EVENT_SUBMIT_LABELS;
  readonly locationPlaceholders = EVENT_LOCATION_PLACEHOLDERS;

  private readonly destroy$ = new Subject<void>();

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
    if (this.drawerData) this.patchForm(this.drawerData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  maxCharactersLabel(count: number): string {
    return $localize`:@@audit.eventMeeting.maxCharacters:Maximum ${count}:count: characters.`;
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group(
      {
        title:          ['', [Validators.required, Validators.maxLength(EVENT_FIELD_LIMITS.TitleMax)]],
        eventType:      [null, [Validators.required]],
        description:    ['', [Validators.maxLength(EVENT_FIELD_LIMITS.DescriptionMax)]],
        startDate:      [null, [Validators.required]],
        startTime:      [null, [Validators.required]],
        endDate:        [null, [Validators.required]],
        endTime:        [null, [Validators.required]],
        locationType:   [null, [Validators.required]],
        locationDetail: [''],
        organizer:      [null, [Validators.required]],
        participants:   [[], [Validators.required]],
        linkedScope:    [null],
        linkedTask:     [null],
        linkedRFI:      [null],
        linkedFindings: [null],
      },
      { validators: [endAfterStartValidator(), virtualLinkValidator()] }
    );
  }

  private patchForm(ev: AuditEvent): void {
    const start = ev.startDateTime ? new Date(ev.startDateTime) : null;
    const end   = ev.endDateTime   ? new Date(ev.endDateTime)   : null;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const toTimeStr = (d: Date | null) =>
      d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : null;

    // Re-split linkedEntities back into per-type arrays
    const le = ev.linkedEntities ?? [];

    this.form.patchValue({
      title:          ev.title,
      eventType:      ev.eventType,
      description:    ev.description ?? '',
      startDate:      start,
      startTime:      toTimeStr(start),
      endDate:        end,
      endTime:        toTimeStr(end),
      locationType:   ev.locationType,
      locationDetail: ev.locationDetail ?? '',
      organizer:      ev.organizer ?? null,
      participants:   ev.participants ?? [],
      linkedScope:    le.find(e => e.type === EventLinkedEntityTypes.Scope)   ?? null,
      linkedTask:     le.find(e => e.type === EventLinkedEntityTypes.Task)    ?? null,
      linkedRFI:      le.find(e => e.type === EventLinkedEntityTypes.RFI)     ?? null,
      linkedFindings: le.find(e => e.type === EventLinkedEntityTypes.Finding) ?? null,
    });
  }

  // ── Submit / Cancel ───────────────────────────────────────────────────────

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
       this.toast.error(EVENT_TOAST_MESSAGES.ValidationError, EVENT_TOAST_MESSAGES.ValidationErrorTitle);
      // this.messageService.add({
      //   severity: 'warn', summary: 'Validation Error',
      //   detail: 'Please fix the highlighted fields.', life: 4000,
      // });
      return;
    }

    this.submitting.set(true);

    setTimeout(() => {
      const v = this.form.getRawValue();

      const startDateTime = combineDateAndTime(v.startDate, v.startTime ? parseTime(v.startTime) : null);
      const endDateTime   = combineDateAndTime(v.endDate,   v.endTime   ? parseTime(v.endTime)   : null);

      const linkedEntities = [
        v.linkedScope,
        v.linkedTask,
        v.linkedRFI,
        v.linkedFindings,
      ].filter((e): e is NonNullable<typeof e> => !!e);

      const payload: AuditEvent = {
        id:             this.drawerData?.id ?? crypto.randomUUID(),
        title:          v.title.trim(),
        description:    v.description?.trim(),
        eventType:      v.eventType,
        linkedEntities,
        organizer:      v.organizer || this.drawerData?.organizer || this.currentUser,
        participants:   v.participants ?? [],
        startDateTime:  startDateTime!,
        endDateTime:    endDateTime!,
        locationType:   v.locationType,
        locationDetail: v.locationDetail?.trim(),
        attachments:    this.uploadedFiles.map(f => ({
          id: crypto.randomUUID(), name: f.name, size: f.size, type: f.type, file: f,
        })),
        createdAt:  this.drawerData?.createdAt ?? new Date(),
        updatedAt:  new Date(),
      };
      this.drawerRef.close(payload)
      var msg="";
      msg=this.isEditMode()
            ? EVENT_TOAST_MESSAGES.Updated
            : EVENT_TOAST_MESSAGES.Added;
      this.toast.success(msg);
      // this.messageService.add({
      //   severity: 'success',
      //   summary:  this.isEditMode() ? 'Updated' : 'Created',
      //   detail:   `"${payload.title}" saved successfully.`,
      // });

      this.submitting.set(false);
      this.cdr.markForCheck();

     // setTimeout(() => this.drawerRef.close(payload), 1000);
    }, EVENT_SUBMIT_DELAY_MS);
  }

  cancel(): void {
    this.drawerRef.close(null);
  }

  // ── File Upload ───────────────────────────────────────────────────────────

  onNativeFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) this.addFiles(Array.from(event.dataTransfer.files));
  }

  private addFiles(files: File[]): void {
    this.uploadedFiles = [...this.uploadedFiles, ...files.filter(f => f.size <= EVENT_MAX_FILE_SIZE_BYTES)];
  }

  removeFile(i: number): void {
    this.uploadedFiles = this.uploadedFiles.filter((_, idx) => idx !== i);
  }

  // ── Validation helpers ────────────────────────────────────────────────────

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  groupError(key: string): boolean {
    return !!(
      this.form.hasError(key) &&
      (this.form.get('startDate')?.touched || this.form.get('endDate')?.touched)
    );
  }

  get titleLen(): number { return this.form.get('title')?.value?.length ?? 0; }
  get descLen():  number { return this.form.get('description')?.value?.length ?? 0; }
}