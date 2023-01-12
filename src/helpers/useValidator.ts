import { useState } from "react";

type ErrorsMap<T> = {
  [key in keyof Omit<T, 'id'>]?: {
    message: string;
    optional?: boolean;
    email?: string;
    min?: { value: number, message: string };
  };
}

export type Errors<T> = {
  [key in keyof Omit<T, 'id'>]?: string;
}

type UseValidatorReturn<T> = [Errors<T>, ((saveCallback: () => void, extraCallback?: () => (keyof Omit<T, 'id'>)[]) => void), ((error: string | null, input: keyof Omit<T, 'id'>) => void)]

export function useValidator<T extends (object & { id?: number })>({id, ...object}: T, errorsMap: ErrorsMap<T>): UseValidatorReturn<T> {
  const [errors, setErrors] = useState({} as Errors<T>);

  function valid(saveCallback: () => void, extraCallback?: () => (keyof Omit<T, 'id'>)[]) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const items = Object.keys(errorsMap) as (keyof Omit<T, 'id'>)[];
    // const items = Object.keys(object) as (keyof Omit<T, 'id'>)[];
    if (!items.length) return;

    const response = items.filter((item) => {

      if (!errorsMap[item]?.optional) {
        if (
            (object[item] && Array.isArray(object[item]) ? !(object as any)[item].length :
            typeof object[item] === 'number' ? (object[item] === null || object[item] === undefined) : !object[item])
          ) { // verify if exist
            errorsMap[item] && handleError(errorsMap[item]!.message, item);
          return true;
        }
        else if (errorsMap[item]?.email && !emailRegex.test((object[item] as string).trim() as string)) { // verify if email is valid
          errorsMap[item] && handleError(errorsMap[item]!.email!, item);
          return true;
        }
      }


      if (errorsMap[item]?.min && ((object[item] as string).length < errorsMap[item]!.min!.value)) {
        errorsMap[item] && handleError(errorsMap[item]!.min!.message!, item);
        return true;
      }

      return false;
    })

    const extra = extraCallback ? extraCallback() : [];

    if (![...response, ...extra].length) return saveCallback();
  }

  function handleError(error: string | null, input: keyof Omit<T, 'id'>) {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return [errors, valid, handleError];
}
