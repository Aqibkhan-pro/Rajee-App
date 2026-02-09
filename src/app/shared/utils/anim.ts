import {
  trigger, transition, style, animate, query, group, AnimationTriggerMetadata
} from '@angular/animations';

const slideSteps = [
  transition(':increment', [
    query(':enter, :leave', style({ position: 'absolute', inset: 0 }), { optional: true }),
    group([
      query(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('220ms ease-in-out', style({ transform: 'translateX(-18%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(18%)', opacity: 0 }),
        animate('220ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true }),
    ]),
  ]),
  transition(':decrement', [
    query(':enter, :leave', style({ position: 'absolute', inset: 0 }), { optional: true }),
    group([
      query(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('220ms ease-in-out', style({ transform: 'translateX(18%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-18%)', opacity: 0 }),
        animate('220ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true }),
    ]),
  ]),
];

export const stepAnim: AnimationTriggerMetadata = trigger('stepAnim', slideSteps);

// ✅ IMPORTANT: trigger name must be 'locationAnim'
export const locationAnim: AnimationTriggerMetadata = trigger('locationAnim', slideSteps);
