import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  selectedFile: any = null;
  isLoading: boolean = false;
  message: string = '';
  progress: number = 0;
  checkValid: boolean = false;

  // Form struct group
  newsForm = this.fb.group({
    subject: ['', Validators.required],
    emails: this.fb.array([
      this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      })
    ]),
    file: ['', Validators.required],
    message: [''],
  });

  // Get form controls from group
  get subject() { return this.newsForm.get('subject'); }
  get emails() { return this.newsForm.controls['emails'] as FormArray; }
  get file() { return this.newsForm.get('file'); }

  constructor(private newsletterService: NewsletterService, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // Get email control as a FormGroup
  getEmailByIndex(index: number): FormGroup {
    return this.emails.at(index) as FormGroup;
  }

  // Asign selected file
  onFileSelected(event: any): void {
    this.checkValid = true;
    this.selectedFile = event.target.files[0] ?? null;
  }

  // Get error validations messages
  getErrorMessage(field: any) {
    if (field.hasError('required')) {
      return 'You must enter a value';
    }

    return field.hasError('email') ? 'Not a valid email' : '';
  }

  // Add and remove email inputs
  addRemoveEmail(index: number) {
    if (index == 0) {
      this.emails.push(this.fb.group({ email: ['', [Validators.required, Validators.email]] }));
    } else {
      this.emails.removeAt(this.emails.value.indexOf(index));
    }
  }

  // Submit form and selected file to newsletter service and show success or error message
  onSubmit() {
    this.checkValid = true;

    if (this.newsForm.valid) {
      this.isLoading = true;

      console.log(this.newsForm.value);
      console.log(this.selectedFile);

      this.newsletterService.sendNewsletter(this.newsForm.value, this.selectedFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.isLoading = false;
            this._snackBar.open(`${this.message} ✅`);
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.isLoading = false;
          this.selectedFile = undefined;
          this._snackBar.open(`${this.message} ❌`);
        });
    }
  }

}
