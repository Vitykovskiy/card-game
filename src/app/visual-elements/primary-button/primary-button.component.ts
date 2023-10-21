import { Component, Input } from '@angular/core';

@Component({
  selector: 'primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent {
  @Input() name: string | undefined;
  @Input() icon: string | undefined;
  @Input() extended: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: 'main' | 'secondary' = 'main';
  @Input() scale: number = 1;

  buttonContainerStyle(): { [key: string]: string } {
    return {
      width: this.extended ? '100%' : `${50 * this.scale}px`, // Здесь можно задать свою размерность ширины контейнера
      height: `${50 * this.scale}px`, // Здесь можно задать свою размерность ширины контейнера
    };
  }

  buttonStyle(): { [key: string]: string } {
    const options = {
      transform: `scale(${this.scale})`,
    } as any;
    if (this.extended) {
      options.width = `${100 * this.scale}%`;
    }
    return options;
  }

  ngOnInit() {}
}
