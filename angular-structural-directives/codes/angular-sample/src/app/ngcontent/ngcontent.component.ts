import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ngcontent',
    templateUrl: './ngcontent.component.html',
    styleUrls: ['./ngcontent.component.scss'],
})
export class NgcontentComponent {
    arr: { id: string; value: string }[] = [{ id: 'id1', value: 'val1' }, { id: 'id2', value: 'val2' }];
    clearButtonClick() {
        this.arr = [];
    }
}
