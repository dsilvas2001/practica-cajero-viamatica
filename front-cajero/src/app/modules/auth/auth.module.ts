import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../../core/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [SignUpComponent, SignInComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule, HttpClientModule],
  providers: [AuthService],
})
export class AuthModule {}
