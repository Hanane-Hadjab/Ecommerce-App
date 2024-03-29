import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
    selector: 'app-login-status',
    templateUrl: './login-status.component.html',
    styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

    isAuthenticated: boolean = false;
    userFullName: string = '';

    storage: Storage = sessionStorage;
    constructor(private oktaAuthService: OktaAuthStateService,
                @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ) {
    }

    ngOnInit(): void {
        // subscribe to authentication state changes

        this.oktaAuthService.authState$.subscribe(
            (result) => {
                this.isAuthenticated = result.isAuthenticated!;
                this.getUserDetails();
            }
        )
    }

    private getUserDetails() {
        if (this.isAuthenticated) {
            // fetch the logged in user details
            this.oktaAuth.getUser().then(
                (res) => {
                    this.userFullName = res.name as string;
                    const theEmail = res.email;

                    this.storage.setItem("userEmail", JSON.stringify(theEmail));
                }
            );
        }
    }

    logout() {
        // terminate the session with okta and removes current token
        this.oktaAuth.signOut();
    }
}
