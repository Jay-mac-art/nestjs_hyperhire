import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsIndianDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isIndianDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // check if value matches the format dd/mm/yyyy
          const regex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if (!regex.test(value)) {
            return false;
          }

          // convert the value to a date object and check if it is valid
          const [day, month, year] = value.split('/').map(Number);
          const date = new Date(year, month - 1, day);
          if (isNaN(date.getTime())) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Indian date in dd/mm/yyyy format`;
        },
      },
    });
  };
}
