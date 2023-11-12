import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'association-input',
  templateUrl: './association-input.component.html',
  styleUrls: ['./association-input.component.scss'],
})
export class AssociationInputComponent {
  @Output() associationText = new EventEmitter<string>();

  public associationForm = new FormGroup({
    association: new FormControl(null),
  });
  public isAssociationTextReady = false;

  sendMessage() {
    const association = this.associationForm.controls['association'].value;
    if (association) {
      this.isAssociationTextReady = true;
      this.associationText.emit(association);
      console.log(association);
    }
  }

  editMessage() {
    this.isAssociationTextReady = false;
  }
}
