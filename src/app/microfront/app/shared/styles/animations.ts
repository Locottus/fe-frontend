import { animate, AUTO_STYLE, query, stagger, state, style, transition, trigger } from '@angular/animations';

export const Animations = {
    validatorsInOutAnimation:   trigger('validatorsInOutAnimation', [
      transition(':enter', [style({ height: 0, opacity: 0 }), animate('0.5s ease-out', style({ height: 48, opacity: 1 }))]),
      transition(':leave', [style({ height: 48, opacity: 1 }), animate('0.5s ease-in', style({ height: 0, opacity: 0 }))]),
    ]),
    collapse: trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, opacity: AUTO_STYLE })),
      state('true', style({ height: '0', opacity: 0 })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out')),
    ]),
    childAnimation: trigger('child-animation', [
        transition(':enter', [
          query('.child-animation', [
            style({ opacity: 0 }),
            stagger('200ms', [
              animate('300ms ease-out', style({ opacity: 0 })),
              animate('200ms ease-out', style({ opacity: 1 })),
            ]),
          ]),
        ]),
    ]),
};
