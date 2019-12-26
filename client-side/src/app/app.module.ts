import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { HttpConfigInterceptor } from './shared/http-interceptor/http-config-interceptor';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountComponent } from './components/account/account.component';
import { AlertModalComponent } from './shared/components/alert-modal/alert-modal.component';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ReferralService } from './services/referral.service';
import { LoadingScreen } from './shared/utils/loading-screen.utils';

import { Alert } from './shared/utils/alert.utils';
import { Modal } from './shared/utils/modal.utils';
import { CanActivateRouteGuard } from './guards/can-activate.guards';


const NOTIFIER_CONFIG: NotifierOptions = {
    position: {
        horizontal: { position: 'right' },
        vertical: { position: 'top', distance: 80 },
    },
    behaviour: { autoHide: 3000, showDismissButton: false },
    theme: 'material'
};

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SigninComponent,
        SignupComponent,
        LoadingScreenComponent,
        DashboardComponent,
        AccountComponent,
        AlertModalComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MDBBootstrapModule.forRoot(),
        NotifierModule.withConfig(NOTIFIER_CONFIG),
        HttpClientModule
    ],
    entryComponents: [
        AlertModalComponent,
    ],
    providers: [
        AuthService,
        UserService,
        ReferralService,
        LoadingScreen,
        Alert,
        Modal,
        CanActivateRouteGuard,
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
