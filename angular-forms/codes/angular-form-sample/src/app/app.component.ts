import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(private formBuilder: FormBuilder) {}

    userInfoForm = this.formBuilder.group<{ username: string; sites: string[]; financialInfo: { financialId: string } }>({
        username: [, [Validators.required]],
        sites: this.formBuilder.array([]),
        financialInfo: this.formBuilder.group({ financialId: [''] }),
    });
}
