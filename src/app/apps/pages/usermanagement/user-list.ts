import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';

interface TransactionUser {
    id: number;
    userName: string;
}

interface TransactionAuditor {
    id: number;
    userName: string;
    email: string;
    password: string;
}

interface Transaction {
    id: number;
    transactionDate: string;
    userId: number;
    user: TransactionUser;
    auditorId: number;
    auditor: TransactionAuditor;
    transactionType: number;
    amount: number;
    currency: string;
}

interface TransactionApiData {
    transactionData: Transaction[];
    pageNumber: number;
    pageSize: number;
    totalTransactions: number;
}

interface TransactionApiResponse {
    statusCode: number;
    data: TransactionApiData;
    primeData: any;
    errorMessage: string | null;
}

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CurrencyPipe, DatePickerModule],
    template: `
        <div class="flex flex-col bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div class="px-6 py-5 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-surface-950 dark:text-surface-0 text-lg font-medium leading-7">Transaction List</h1>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <p-iconfield class="w-full sm:w-[217px]">
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            [(ngModel)]="searchValue"
                            (input)="onGlobalFilter(dt, $event)"
                            placeholder="Search"
                            class="w-full! py-2! rounded-xl!"
                        />
                    </p-iconfield>
                </div>
            </div>

            <div class="flex-1 px-6 py-5">
                <p-table
                    #dt
                    [value]="transactions()"
                    [(selection)]="selectedTransactions"
                    [paginator]="true"
                    [rows]="rows"
                    [first]="first"
                    lazy="true"
                    (onLazyLoad)="onLazyMode($event)"
                    (onPage)="onPageChange($event)"
                    [totalRecords]="totalRecords"
                    sortMode="single"
                    (onSort)="onSortChange($event)"
                    [tableStyle]="{ width: '100%' }"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Shows {first} to {last} of {totalRecords} results"
                    [globalFilterFields]="[
                        'id',
                        'transactionDate',
                        'transactionType',
                        'amount',
                        'currency',
                        'userId',
                        'userName',
                        'auditorId',
                        'userName'
                    ]"
                    class="bg-surface-0 dark:bg-surface-800 overflow-hidden"
                    [pt]="{ pcPaginator: { root: { class: 'rounded-none!' } } }"
                >
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th pSortableColumn="id">
                                <span class="flex items-center gap-2" i18n>Transaction Id <p-sortIcon field="id" /></span>
                            </th>
                            <th pSortableColumn="transactionDate">
                                <span class="flex items-center gap-2" i18n>Transaction Date <p-sortIcon field="transactionDate" /></span>
                            </th>
                            <th pSortableColumn="transactionType">
                                <span class="flex items-center gap-2" i18n>Transaction Type <p-sortIcon field="transactionType" /></span>
                            </th>
                            <th pSortableColumn="amount">
                                <span class="flex items-center gap-2" i18n>Amount <p-sortIcon field="amount" /></span>
                            </th>
                            <th pSortableColumn="currency">
                                <span class="flex items-center gap-2" i18n>Currency <p-columnFilter type="text" field="currency" display="menu" placeholder="Search by name"></p-columnFilter> <p-sortIcon field="currency" /></span>
                            </th>
                            <!-- <th pSortableColumn="userId">
                                <span class="flex items-center gap-2" i18n>User Id <p-sortIcon field="userId" /></span>
                            </th>
                            <th pSortableColumn="userName">
                                <span class="flex items-center gap-2" i18n>User Name <p-columnFilter type="text" field="UserName" display="menu" placeholder="Search by name"></p-columnFilter> <p-sortIcon field="user.userName" /></span>
                            </th> -->
                            <th pSortableColumn="auditorId">
                                <span class="flex items-center gap-2" i18n>Auditor Id <p-sortIcon field="auditorId" /></span>
                            </th>
                            <th pSortableColumn="auditor.userName">
                                <span class="flex items-center gap-2" i18n>Auditor Name <p-sortIcon field="UserName" /></span>
                            </th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-transaction>
                        <tr>
                            <td style="width: 3rem">
                                <p-tableCheckbox [value]="transaction" />
                            </td>

                            <td>
                                <span class="text-surface-950 dark:text-surface-0 text-sm font-medium leading-tight" i18n>
                                    {{ transaction.id }}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction.transactionDate | date: 'medium' }}
                                </span>
                            </td>

                            <td>
                                <p-tag
                                    [value]="getTransactionTypeLabel(transaction.transactionType)"
                                    [severity]="getTransactionTypeSeverity(transaction.transactionType)"
                                    class="px-2 py-1 rounded-[6px]"
                                />
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{  transaction?.amount | currency}}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.currency}}
                                </span>
                            </td>

                            <!-- <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.userId }}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.userName | translate:{ value: transaction?.userName } }}
                                </span>
                            </td> -->

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.auditorId }}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.auditorUserName }}
                                </span>
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="10" class="text-center py-4 text-surface-500 dark:text-surface-400" i18n>
                                No transactions found.
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- transactions from the date -->

           <div class="px-6 py-5 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 class="text-surface-950 dark:text-surface-0 text-lg font-medium leading-7">Select Transactions From The Date</h1>

                <!-- <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <p-iconfield class="w-full sm:w-[217px]">
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            [(ngModel)]="searchValue"
                            (input)="onGlobalFilter(dt, $event)"
                            placeholder="Search"
                            class="w-full! py-2! rounded-xl!"
                        />
                    </p-iconfield>
                </div> -->

                <!-- set time based search -->
                <div class="flex-auto">
                <label for="calendar-24h" class="font-bold block mb-2"> 24h Format </label>
                <p-datepicker inputId="calendar-24h" [(ngModel)]="datetime24h" [showTime]="true" hourFormat="24" (onSelect)="onSelectDate($event)" />
            </div>

            </div>

            <div class="flex-1 px-6 py-5">
                <p-table
                    #dt
                    [value]="transactions()"
                    [(selection)]="selectedTransactions"
                    [paginator]="true"
                    [rows]="rows"
                    [first]="first"
                    lazy="true"
                    (onLazyLoad)="onLazyMode($event)"
                    (onPage)="onPageChange($event)"
                    [totalRecords]="totalRecords"
                    sortMode="single"
                    (onSort)="onSortChange($event)"
                    [tableStyle]="{ width: '100%' }"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Shows {first} to {last} of {totalRecords} results"
                    [globalFilterFields]="[
                        'id',
                        'transactionDate',
                        'transactionType',
                        'amount',
                        'currency',
                        'userId',
                        'userName',
                        'auditorId',
                        'userName'
                    ]"
                    class="bg-surface-0 dark:bg-surface-800 overflow-hidden"
                    [pt]="{ pcPaginator: { root: { class: 'rounded-none!' } } }"
                >
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th pSortableColumn="id">
                                <span class="flex items-center gap-2" i18n>Transaction Id <p-sortIcon field="id" /></span>
                            </th>
                            <th pSortableColumn="transactionDate">
                                <span class="flex items-center gap-2" i18n>Transaction Date <p-sortIcon field="transactionDate" /></span>
                            </th>
                            <th pSortableColumn="transactionType">
                                <span class="flex items-center gap-2" i18n>Transaction Type <p-sortIcon field="transactionType" /></span>
                            </th>
                            <th pSortableColumn="amount">
                                <span class="flex items-center gap-2" i18n>Amount <p-sortIcon field="amount" /></span>
                            </th>
                            <th pSortableColumn="currency">
                                <span class="flex items-center gap-2" i18n>Currency <p-columnFilter type="text" field="currency" display="menu" placeholder="Search by name"></p-columnFilter> <p-sortIcon field="currency" /></span>
                            </th>
                            <!-- <th pSortableColumn="userId">
                                <span class="flex items-center gap-2" i18n>User Id <p-sortIcon field="userId" /></span>
                            </th>
                            <th pSortableColumn="userName">
                                <span class="flex items-center gap-2" i18n>User Name <p-columnFilter type="text" field="UserName" display="menu" placeholder="Search by name"></p-columnFilter> <p-sortIcon field="user.userName" /></span>
                            </th> -->
                            <th pSortableColumn="auditorId">
                                <span class="flex items-center gap-2" i18n>Auditor Id <p-sortIcon field="auditorId" /></span>
                            </th>
                            <th pSortableColumn="auditor.userName">
                                <span class="flex items-center gap-2" i18n>Auditor Name <p-sortIcon field="UserName" /></span>
                            </th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-transaction>
                        <tr>
                            <td style="width: 3rem">
                                <p-tableCheckbox [value]="transaction" />
                            </td>

                            <td>
                                <span class="text-surface-950 dark:text-surface-0 text-sm font-medium leading-tight" i18n>
                                    {{ transaction.id }}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction.transactionDate | date: 'medium' }}
                                </span>
                            </td>

                            <td>
                                <p-tag
                                    [value]="getTransactionTypeLabel(transaction.transactionType)"
                                    [severity]="getTransactionTypeSeverity(transaction.transactionType)"
                                    class="px-2 py-1 rounded-[6px]"
                                />
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{  transaction?.amount | currency}}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.currency}}
                                </span>
                            </td>

                            <!-- <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.userId }}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.userName | translate:{ value: transaction?.userName } }}
                                </span>
                            </td> -->

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.auditorId }}
                                </span>
                            </td>

                            <td>
                                <span class="text-surface-500 dark:text-surface-400 text-sm font-normal leading-tight" i18n>
                                    {{ transaction?.auditorUserName }}
                                </span>
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="10" class="text-center py-4 text-surface-500 dark:text-surface-400" i18n>
                                No transactions found.
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

        </div>
    `
})
export class UserList implements OnInit {
    @ViewChild('dt') dt!: Table;

    private apiUrl = `${environment.apiBaseUrl}/Audit/get-transactions`;
    private dateApiUrl = 'http://localhost:5251/api/Audit/get-transactions-from-date';

    transactions = signal<Transaction[]>([]);
    selectedTransactions: Transaction[] = [];

    TimeZones = [
        { name: 'India Standard Time (IST)', value: 'Asia/Kolkata' },
        { name: 'China Standard Time (CST)', value: 'Asia/Shanghai' },
        { name: 'Japan Standard Time (JST)', value: 'Asia/Tokyo' },
        { name: 'Gulf Standard Time (Dubai)', value: 'Asia/Dubai' },
        { name: 'Central European Time (Spain)', value: 'Europe/Madrid' },
        { name: 'Central European Time (Germany)', value: 'Europe/Berlin' },
        { name: 'Central European Time (France)', value: 'Europe/Paris' }
    ];

    searchValue = '';
    first = 0;
    rows = 6;
    totalRecords = 0;
    currentPage = 1;
    sortField: string = 'id';
    sortOrder: number = 1;

    datetime12h: Date[] | undefined;
    datetime24h: Date[] | undefined;
    time: Date[] | undefined;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadTransactions(this.currentPage, this.rows);
    }

    loadTransactions(pageNumber: number, pageSize: number): void {
        let params = new HttpParams()
            .set('PageNumber', pageNumber.toString())
            .set('PageSize', pageSize.toString())
            .set('SortField', this.sortField)
            .set('SortOrder', this.sortOrder);

        this.http.get<TransactionApiResponse>(this.apiUrl, { params }).subscribe({
            next: (response) => {
                this.transactions.set(response.data?.transactionData ?? []);

                this.currentPage = response.data?.pageNumber ?? pageNumber;
                this.rows = response.data?.pageSize ?? pageSize;
                this.first = (this.currentPage - 1) * this.rows;

                this.totalRecords = response.data?.totalTransactions ?? 0;
            },
            error: () => {
                this.transactions.set([]);
                this.totalRecords = 0;
                alert('Failed to load transactions');
            }
        });
    }

    onSortChange(event: any): void {
        if (!event?.field || event?.order == null) {
            return;
        }

        this.sortField = event.field;
        this.sortOrder = event.order;
        this.loadTransactions(1, this.rows);
    }

    onPageChange(event: any): void {
        const pageSize = event.rows;
        const pageNumber = Math.floor(event.first / event.rows) + 1;

        this.loadTransactions(pageNumber, pageSize);
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onLazyMode(event: any): void {
        console.log("lazy load event:", event);
    }

    onSelectDate(event: any): void {
        const selectedDate = new Date(event.toLocaleString());
        console.log("Selected date: ", selectedDate);
    }

    getTransactionTypeLabel(type: number): string {
        switch (type) {
            case 1:
                return 'Credit';
            case 2:
                return 'Debit';
            default:
                return 'Unknown';
        }
    }

    getTransactionTypeSeverity(type: number): 'success' | 'warn' | 'secondary' {
        switch (type) {
            case 1:
                return 'success';
            case 2:
                return 'warn';
            default:
                return 'secondary';
        }
    }
}