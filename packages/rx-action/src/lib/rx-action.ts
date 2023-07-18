import { Observable, Subject } from 'rxjs';

export const createRxAction = <T, U>(
  factoryFunction: (argument: Observable<T>) => U
) => {
  const action = new Subject<T>();

  function trigger(value: T) {
    const injector = (trigger as any)['injector'];
    if (injector) {
      injector.runInContext(() => {
        action.next(value);
      });
    } else {
      action.next(value);
    }
  }

  trigger['$'] = factoryFunction(action.asObservable());

  return new Proxy<((argument: T) => void) & { $: U }>(trigger, {
    apply(target, thisArgument, args) {
      Reflect.apply(trigger, this, [...args]);
    },
  });
};
