import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null; //should return null or nothing to be valid
  }

  return { doesNotContainQuestionMark: true };
}

//Normally used to send httprequest to backend to check if the email alrady exists
function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null); //should return observable to be valid
  }

  return of({ notUnique: true });
}

//Only possible with reactive form
let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule],
})
export class LoginComponent implements OnInit{
	
	private destroyRef = inject(DestroyRef);
	form = new FormGroup({
		email: new FormControl(initialEmailValue, {
		validators: [Validators.required, Validators.email],
		asyncValidators: [emailIsUnique],
		}),
		password: new FormControl('', {
		validators: [
			Validators.required,
			Validators.minLength(6),
			mustContainQuestionMark,
		],
		}),
	});

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit() {
	//ngOnInit only with reactive, in template ngAfterRenderNext.

    // const savedForm = window.localStorage.getItem('saved-login-form');

    // if (savedForm) {
    //   const loadedForm = JSON.parse(savedForm);
    //   this.form.patchValue({
    //     //patchValue to partially update the value only available in reactive forms
    //     email: loadedForm.email,
    //   });
    // } 

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
    	},
    });

	this.destroyRef.onDestroy(()=>subscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
