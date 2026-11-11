
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { AuditService } from '@/app/features/audits/audit-plan/audit-plan/services/audit-details.services';
import { AuditProcess } from '@/app/apps/poc/Audit/process/audit-details.process';

import { FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { LoggerService } from '../../../../shared/services/logger.service';

@Component({
  selector: 'app-audit-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
    CheckboxModule,
    TextareaModule,TableModule,FileUploadModule,ToastModule,MessageModule
  ],
  templateUrl: './audit-details.component.html',
  styleUrls: ['./audit-details.component.scss'] ,
  providers: [MessageService]
})
export class AuditDetailsComponent {
  successMessage: string = '';
errorMessage: string = '';
uploadedFiles: any[] = [];

    basicUploadedFiles: any[] = [];
   
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
 constructor(private logger: LoggerService,private auditProcess: AuditProcess,private route: ActivatedRoute,private router: Router,private service: MessageService) {}

  async save(form: any) {
   
   this.logger.error('User saved products', 1, '',JSON.stringify({
      name: 'meen',
      description: 'test',
      price: 100,
      stock: 10,
      category: this.audit.observations    
    }),null,'save');
    
    if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }
  //---POST METHOD
  const payload = {
      name: "meenu",
      description: this.audit.id,
      price: "100",
      stock: 10,
      category: this.audit.observations    
    };
//const base64Key = "q83vV6Xc1k2Z7lP4mYt9sQ2xW8rJ0nF5uK3aD6bH9cE=";
//const keyBytes = this.fromBase64(base64Key);

// const cryptoKey =  await crypto.subtle.importKey(
//   "raw",
//   keyBytes as BufferSource,
//   { name: "AES-GCM" },
//   false,
//   ["encrypt", "decrypt"]
// );
    
    //const encryptedPayload = await this.cryptoService.encrypt(cryptoKey, JSON.stringify(payload));
   // console.log('encrypted',encryptedPayload);

      this.auditProcess.saveProduct(payload).subscribe({
      next: async (res) => {
        console.log('Saved successfully\n API Response : \n', res);
        //const plaintext = await this.cryptoService.decrypt(cryptoKey, res);
        //console.log(res);
       // const product = JSON.parse(plaintext);
        form.resetForm();
        this.successMessage = 'Saved successfully';
       this.service.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Saved successfully'
        });
      },
      error: (err) => {
        console.error('Save failed', err);
         //this.errorMessage = this.errorHandler.getErrorMessage(err);
         this.service.add({
            severity: 'error',
            summary: 'Error Message',
            detail: this.errorMessage
        });
         console.error("Error : \n",err.error);
      }
    });

 



//  const payload = {
//       auditType: this.audit.auditType,
//       location: this.audit.location?.value ?? this.audit.location,
//       riskLevel: this.audit.riskLevel?.value ?? this.audit.riskLevel,
//       priority: this.audit.priority,
//       observations: this.audit.observations,
//       departments: (this.audit.departments || []).map((d: any) => d.value ?? d),
//       isPlanned: this.audit.isPlanned,
//       needsFollowUp: this.audit.needsFollowUp
//     };
//     this.auditProcess.saveAudit(payload).subscribe({
//       next: (res) => {
//         console.log('Saved successfully', res);
//         form.resetForm();
//         this.audit = {
//           auditType: '',
//           location: null,
//           riskLevel: null,
//           priority: '',
//           observations: '',
//           departments: [],
//           isPlanned: false,
//           needsFollowUp: false
//         };
//          this.successMessage = 'Saved successfully';
//       },
//       error: (err) => {
//         console.error('Save failed', err);
//          this.errorMessage = this.errorHandler.getErrorMessage(err);
//          console.error("Error : \n",this.errorMessage);
//       }
//     });
  console.log('Saving audit', this.audit);
  }
  fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
modify()
{
//---PUT METHOD
const payloadForPut = {
      name: this.audit.auditType,
      price: 100,
      stock: 10,
      category: this.audit.observations    
    };
    console.log(payloadForPut);
 this.auditProcess.modifyProduct(payloadForPut,"1").subscribe({
      next: (res) => {
        console.log('Edited successfully\n API Response : \n', res);
       // form.resetForm();
        this.successMessage = 'Saved successfully';
        this.service.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Saved successfully'
        });
      },
      error: (err) => {
        console.error('Editing of product failed\n', err);
         //this.errorMessage = this.errorHandler.getErrorMessage(err);
         this.service.add({
            severity: 'error',
            summary: 'Error Message',
            detail: this.errorMessage
        });
         console.error("Error : \n",this.errorMessage);
      }
    });

    
}
remove()
{
  //---DELETE METHOD

 this.auditProcess.removeProduct("9").subscribe({
      next: (res) => {
        console.log('Removed product successfully\n API Response : \n', res);
       // form.resetForm();
        this.successMessage = 'Saved successfully';
        this.service.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Saved successfully'
        });
      },
      error: (err) => {
        console.error('Removal failed\n', err);
        // this.errorMessage = this.errorHandler.getErrorMessage(err.error);
         this.service.add({
            severity: 'error',
            summary: 'Error Message',
            detail: this.errorMessage
        });        
         console.error("Error : \n",this.errorMessage);
      }
    });
}
patch()
{
//---PATCH METHOD
const payloadForPatch = {
      name: this.audit.auditType,
      description: this.audit.id,
      price: 100,
      stock: 10,
      category: this.audit.observations    
    };
 this.auditProcess.patchProduct(payloadForPatch,"1").subscribe({
      next: (res) => {
        console.log('Patched product successfully\n API Response : \n', res);
       // form.resetForm();
        this.successMessage = 'Saved successfully';
        this.service.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Saved successfully'
        });
      },
      error: (err) => {
        console.error('patching of product failed', err);
        // this.errorMessage = this.errorHandler.getErrorMessage(err);
         this.service.add({
            severity: 'error',
            summary: 'Error Message',
            detail: this.errorMessage
        });
         console.error("Error : \n",this.errorMessage);
      }
    });
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
  onUpload(event: any, arg: string) {
        if (arg === 'basic') {
            for (const file of event.files) {
                this.basicUploadedFiles.push(file);
            }
        } else {
            for (const file of event.files) {
                this.uploadedFiles.push(file);
            }
        }
       
    }
  onUploadHandler(event: { files: File[] }) {
  const files = event.files;
  console.log('Upload button clicked! Files:', files);
  // Your custom upload logic here
  const formData = new FormData();
  files.forEach(file => formData.append('file', file));
this.auditProcess.uploadAuditFiles(formData).subscribe({
      next: (res) => {
        console.log('Saved successfully', res);
        //form.resetForm();
        this.successMessage = 'File uploaded successfully';
        console.error("Success : \n",this.successMessage);
      },
      error: (err) => {
        console.error('Save failed', err);
         //this.errorMessage = this.errorHandler.getErrorMessage(err);
           console.error("Error : \n", this.errorMessage);
      }
    });
  
}
  ngOnInit() {
    this.logger.setUserId("123");
   // throw new Error('Manual error — caught by GlobalErrorHandler');
  this.route.queryParamMap.subscribe(params => {
    //const id = params.get('term');
    //const id = this.route.snapshot.paramMap.get('id');
    //console.log(id);
    const state = history.state.user.role;   
    console.log(state);
  });
}
}