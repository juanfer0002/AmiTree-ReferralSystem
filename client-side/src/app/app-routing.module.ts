import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { CanActivateRouteGuard } from './guards/can-activate.guards';


const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent, canActivate: [CanActivateRouteGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [CanActivateRouteGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateRouteGuard] },
    { path: 'account', component: AccountComponent, canActivate: [CanActivateRouteGuard] },

    // Redirect to dashboard unkown routes
    { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
