import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform<T>(value: T, metadata: ArgumentMetadata): Promise<T> {
    const validationErrors = await ValidationPipe.validate(value, metadata);

    if (validationErrors.length === 0) {
      return value;
    }

    const errorProperties = validationErrors.map((e) => e.property).join(',');
    const constraintsMsg = validationErrors.map((e) => e.constraints).join(',');
    throw {
      timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      // message: `Validation errors with properties ${errorProperties}`,
      message: `Validation errors with properties ${constraintsMsg}`,
      errorfields: errorProperties,
      httpStatus: 400,
      customErrorNumber: -2,
    };
  }

  static async validate(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<ValidationErrorDto[]> {
    console.log('-----------', value, metatype);
    if (value === null) {
      value = Object.assign({}, value);
    }

    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return [];
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length === 0) {
      return [];
    }

    const topLevelErrors: ValidationErrorDto[] = errors
      .filter((v) => v.constraints)
      .map((error) => ({
        property: error.property,
        constraints: Object.values(error.constraints as any),
      }));

    const nestedErrors: ValidationErrorDto[] = [];
    errors
      .filter((v) => !v.constraints)
      .forEach((error) => {
        if (error.children) {
          const validationErrors =
            ValidationPipe.getValidationErrorsFromChildren(
              error.property,
              error.children,
            );
          nestedErrors.push(...validationErrors);
        }
      });

    return topLevelErrors.concat(nestedErrors);
  }

  static toValidate(metatype: any): boolean {
    const types: Array<() => any> = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  static getValidationErrorsFromChildren(
    parent: string,
    children: ValidationError[],
    errors: ValidationErrorDto[] = [],
  ): ValidationErrorDto[] {
    children.forEach((child) => {
      if (child.constraints) {
        errors.push({
          property: `${parent}.${child.property}`,
          constraints: Object.values(child.constraints),
        });
      } else if (child.children) {
        return this.getValidationErrorsFromChildren(
          `${parent}.${child.property}`,
          child.children,
          errors,
        );
      }
    });

    return errors;
  }
}

export interface ValidationErrorDto {
  property: string;
  constraints: string[];
}
