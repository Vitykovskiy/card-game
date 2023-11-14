import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'association-input',
  templateUrl: './association-input.component.html',
  styleUrls: ['./association-input.component.scss'],
})
export class AssociationInputComponent {
  @Output() saveText = new EventEmitter<string>();
  @Output() editText = new EventEmitter<void>();

  public associationForm = new FormGroup({
    association: new FormControl(null),
  });
  public isAssociationTextReady = false;

  onSaveText() {
    const association = this.associationForm.controls['association'].value;
    if (association) {
      this.isAssociationTextReady = true;
      this.saveText.emit(association);
      console.log(association);
    }
  }

  onEditText() {
    this.editText.emit();
    this.isAssociationTextReady = false;
  }
}
