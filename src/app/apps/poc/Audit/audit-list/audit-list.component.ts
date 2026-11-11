import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/app/pages/service/product.service';

import { CardModule } from 'primeng/card';

import { DatePickerModule } from 'primeng/datepicker';

import { CheckboxModule } from 'primeng/checkbox';

// import { AuditService } from '@/app/Services/audit-details.services';
// import { AuditProcess } from '@/app/Process/audit-details.process';
// import { AppErrorHandlerService } from '@/app/Services/api-error-handling.service';
import { Customer, CustomerService, Representative } from '@/app/pages//service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
 interface expandedRows {
    [key: string]: boolean;
}
@Component({
    selector: 'app-audit-list',
    templateUrl: './audit-list.component.html',
  styleUrl: './audit-list.component.scss',
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule, 
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
    CheckboxModule,
    TextareaModule
    ],
    
    providers: [MessageService, ProductService, ConfirmationService]
})
export class AuditList implements OnInit {
    filterFields: string[] = ['code', 'name', 'description', 'price', 'quantity', 'inventoryStatus', 'category', 'rating', 'image'];

    productDialog: boolean = false;

    products =signal<Product[]>([]);
     Products: Product[] = [];

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];
     customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];
    loading: boolean = true;
    representatives: Representative[] = [];

    cols!: Column[];
successMessage: string = '';
errorMessage: string = '';
    constructor(private router: Router,
        private customerService: CustomerService,
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,private auditProcess: AuditProcess, private errorHandler: AppErrorHandlerService
    ) {}
 audit: any= {
    auditTitle: '',
    auditId: '',
    auditor: null as any,
    auditDate: null as Date | null,
    auditType: 'Internal',
    location: null as any,
    riskLevel: null as any,
    priority: 'Medium',
    departments: [] as string[],
    observations: '',
    isPlanned: true,
    needsFollowUp: false
  };
auditIssues = [
  { issue: 'Safety Violation', status: 'Open', dueDate: '15/04/2025' },
  { issue: 'Equipment Check', status: 'In Progress', dueDate: '20/04/2025' },
  { issue: 'Training Records', status: 'Closed', dueDate: '10/04/2025' }
];
  auditors = [
    { name: 'Ayesha Khan', code: 'AK' },
    { name: 'John Smith', code: 'JS' },
    { name: 'Priya Menon', code: 'PM' }
  ];

  locations = [
    { name: 'Dubai Office', code: 'DXB' },
    { name: 'Abu Dhabi Office', code: 'AUH' },
    { name: 'Sharjah Office', code: 'SHJ' }
  ];

  riskLevels = [
    { name: 'Low', code: 'L' },
    { name: 'Medium', code: 'M' },
    { name: 'High', code: 'H' }
  ];

  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];

  departmentOptions = [
    { label: 'Finance', value: 'Finance' },
    { label: 'Operations', value: 'Operations' },
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' }
  ];
    exportCSV() {
        this.dt.exportCSV();
    }

    // ngOnInit() {
    //     this.loadDemoData();
    // }
 ngOnInit() {
    
    //GET METHODS
    this.auditProcess.getProducts().subscribe({
      next: (res) => {
        console.log('Get all products : \n', res);
        //form.resetForm();
        this.successMessage = 'Get products successfully';
        console.log("Success : \n",this.successMessage);
      },
      error: (err) => {
        console.error('Save failed', err);
         this.errorMessage = this.errorHandler.getErrorMessage(err);
         console.error("Error : \n",this.errorMessage);
      }
    });


        this.customerService.getCustomersLarge().then((customers) => {
            this.customers1 = customers;
            this.loading = false;

            // @ts-ignore
            this.customers1.forEach((customer) => (customer.date = new Date(customer.date)));
        });
        this.customerService.getCustomersMedium().then((customers) => (this.customers2 = customers));
        this.customerService.getCustomersLarge().then((customers) => (this.customers3 = customers));
        this.productService.getProductsWithOrdersSmall().then((data) => (this.Products = data));

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'XuXue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }
    loadDemoData() {
        this.productService.getProducts().then((data) => {
            this.products.set(data);
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            {
                field: 'code',
                header: 'Code',
                customExportHeader: 'Product Code'
            },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    saveProduct() {
        this.submitted = true;
        let _products = this.products();
        if (this.product.name?.trim()) {
            if (this.product.id) {
                _products[this.findIndexById(this.product.id)] = this.product;
                this.products.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.products.set([..._products, this.product]);
            }

            this.productDialog = false;
            this.product = {};
        }
    }
    reset() {
    this.audit = {
      auditTitle: '',
      auditId: '',
      auditor: null,
      auditDate: null,
      auditType: 'Internal',
      location: null,
      riskLevel: null,
      priority: 'Medium',
      departments: [],
      observations: '',
      isPlanned: true,
      needsFollowUp: false
    };
  }
  save(form: any) {
   if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }
 const payload = {
      auditType: this.audit.auditType,
      location: this.audit.location?.value ?? this.audit.location,
      riskLevel: this.audit.riskLevel?.value ?? this.audit.riskLevel,
      priority: this.audit.priority,
      observations: this.audit.observations,
      departments: (this.audit.departments || []).map((d: any) => d.value ?? d),
      isPlanned: this.audit.isPlanned,
      needsFollowUp: this.audit.needsFollowUp
    };
    this.auditProcess.saveAudit(payload).subscribe({
      next: (res) => {
        console.log('Saved successfully', res);
        form.resetForm();
        this.audit = {
          auditType: '',
          location: null,
          riskLevel: null,
          priority: '',
          observations: '',
          departments: [],
          isPlanned: false,
          needsFollowUp: false
        };
         this.successMessage = 'Saved successfully';
      },
      error: (err) => {
        console.error('Save failed', err);
         this.errorMessage = this.errorHandler.getErrorMessage(err);
         console.error("Error : \n",this.errorMessage);
      }
    });
  console.log('Saving audit', this.audit);
  }
 navigate()
 {
    //this.router.navigate(['audit-details'], { queryParams: { term: 'angular', page: 1 } });
 //this.router.navigate(['/audit-details', 42]);
 this.router.navigate(['audit-details'], { state: { user: { name: 'Athul', role: 'Admin' } } });
}
  expandedRows: expandedRows = {};
  expandAll() {
        this.expandedRows = this.Products.reduce(
            (acc, p) => {
                if (p.id) {
                    acc[p.id] = true;
                }
                return acc;
            },
            {} as { [key: string]: boolean }
        );
    }

    collapseAll() {
        this.expandedRows = {};
    }
}