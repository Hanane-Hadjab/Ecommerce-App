import {FormControl, ValidationErrors} from "@angular/forms";

export class ShopValidators {
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors | null {
        // check if String only contains whitespace

        if ((control.value != null) && (control.value.trim().length === 0)) {
            return {'notOnlyWhiteSpace': true};
        } else {
            return null;
        }
    }
}
